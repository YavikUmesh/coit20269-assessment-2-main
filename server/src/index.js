"use strict";

const fs = require("fs");
const https = require("https");

const createApp = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");

const app = createApp();

function start() {
  connectDb()
    .then(() => {
      if (env.httpsKeyPath && env.httpsCertPath) {
        const options = {
          key: fs.readFileSync(env.httpsKeyPath),
          cert: fs.readFileSync(env.httpsCertPath),
        };
        https.createServer(options, app).listen(env.port, () => {
          console.log(`StudySwap API listening on HTTPS port ${env.port}`);
        });
      } else {
        // Render terminates TLS at the edge; plain HTTP behind their proxy.
        app.listen(env.port, () => {
          console.log(`StudySwap API listening on HTTP port ${env.port} (TLS terminated upstream)`);
        });
      }
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
      process.exit(1);
    });
}

// MONGODB_URI / JWT_SECRET are validated on load via config/env.js.
start();
