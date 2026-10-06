"use strict";

const express = require("express");

const router = express.Router();

// Health check — no auth required
router.get("/health", (req, res) => {
  res.json({ data: { status: "ok", uptime: process.uptime() } });
});

// Resource routers
router.use("/users", require("./user-router"));
router.use("/listings", require("./listing-router"));

module.exports = router;
