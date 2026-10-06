"use strict";

const mongoose = require("mongoose");
const { mongoUri } = require("./env");

let connected = false;

async function connectDb() {
  if (connected) return;
  await mongoose.connect(mongoUri);
  connected = true;
  console.log("Connected to MongoDB");
}

async function disconnectDb() {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
}

module.exports = { connectDb, disconnectDb };
