"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name is too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email is not valid"],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    campus: {
      type: String,
      enum: ["BNE", "SYD", "MEL", "DST", "other"],
      default: "other",
    },
  },
  { timestamps: true },
);

// Hash the plain password into passwordHash (used by signup).
userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Constant-time-ish bcrypt compare (used by the passport-local strategy).
userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Reuse the compiled model if the module is imported twice (test workers reload modules).
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
