"use strict";

require("dotenv").config();

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

module.exports = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  httpsKeyPath: process.env.HTTPS_KEY_PATH || null,
  httpsCertPath: process.env.HTTPS_CERT_PATH || null,
};
