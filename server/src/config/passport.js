"use strict";

const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: LocalStrategy } = require("passport-local");

const User = require("../models/user-model");
const { jwtSecret } = require("./env");

// JWT strategy — verifies Bearer tokens issued by /api/users/login.
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub).select("-passwordHash");
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// Local strategy — email + password credential check for /api/users/login.
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: String(email).toLowerCase() });
        // Same failure for unknown email vs wrong password — no enumeration.
        if (!user || !(await user.comparePassword(password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

module.exports = passport;
