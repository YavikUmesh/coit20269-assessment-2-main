"use strict";

const passport = require("../config/passport");

// Thin wrapper over the passport-jwt strategy. Keeps the exact 401 JSON
// bodies the client and tests rely on (Passport's default 401 body would
// break that contract):
//   - no/blank header        -> "Authentication required"
//   - bad scheme/garbage     -> "Invalid or expired token"
//   - valid-signed but stale -> "Invalid or expired token"
module.exports = function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      error: { message: "Authentication required", status: 401 },
    });
  }

  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        error: { message: "Invalid or expired token", status: 401 },
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};
