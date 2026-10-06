"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");

const User = require("../models/user-model");
const { jwtSecret } = require("../config/env");

const router = express.Router();

const TOKEN_TTL = "7d";

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, jwtSecret, {
    expiresIn: TOKEN_TTL,
  });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    campus: user.campus,
    createdAt: user.createdAt,
  };
}

// POST /api/users/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, campus } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        error: { message: "Name, email and password are required", status: 400 },
      });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        error: { message: "Password must be at least 8 characters", status: 400 },
      });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash, campus });

    return res.status(201).json({
      data: { token: signToken(user), user: publicUser(user) },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: { message: "An account with this email already exists", status: 409 },
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: { message: Object.values(err.errors)[0].message, status: 400 },
      });
    }
    return next(err);
  }
});

// POST /api/users/login — credentials checked by the passport-local strategy.
// Custom callback so failures keep our JSON error shape (Passport's default
// 401 body is HTML-ish and would break the client contract).
router.post("/login", (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: { message: "Email and password are required", status: 400 },
    });
  }

  passport.authenticate("local", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      // Same message for both cases — never reveal whether the email exists.
      return res.status(401).json({
        error: { message: "Invalid email or password", status: 401 },
      });
    }
    return res.json({
      data: { token: signToken(user), user: publicUser(user) },
    });
  })(req, res, next);
});

// POST /api/users/logout
// JWTs are stateless — the client discards the token. This endpoint exists so
// the client flow has a server call (and future token denylisting if needed).
router.post("/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
  return res.json({ data: { message: "Logged out", userId: req.user.id } });
});

// GET /api/users/me — authenticated profile (used by client on app resume)
router.get("/me", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        error: { message: "User no longer exists", status: 404 },
      });
    }
    return res.json({ data: { user: publicUser(user) } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
