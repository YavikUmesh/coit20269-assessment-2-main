#!/usr/bin/env node
"use strict";

// Generates a self-signed dev certificate for local HTTPS.
// Usage: npm run generate-cert   (or: node scripts/generate-dev-cert.js)
// Output: certs/dev-key.pem + certs/dev-cert.pem (gitignored)
// Uses the `selfsigned` package — no openssl dependency, works on any OS.

const fs = require("fs");
const path = require("path");
const selfsigned = require("selfsigned");

const certsDir = path.join(__dirname, "..", "certs");
const keyPath = path.join(certsDir, "dev-key.pem");
const certPath = path.join(certsDir, "dev-cert.pem");

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log("Dev certificate already exists:");
  console.log(`  key:  ${keyPath}`);
  console.log(`  cert: ${certPath}`);
  process.exit(0);
}

async function main() {
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    console.log("Dev certificate already exists:");
    console.log(`  key:  ${keyPath}`);
    console.log(`  cert: ${certPath}`);
    return;
  }

  const pems = await selfsigned.generate([{ name: "commonName", value: "localhost" }], {
    keySize: 2048,
    days: 365,
    extensions: [
      {
        name: "subjectAltName",
        altNames: [
          { type: 2, value: "localhost" },
          { type: 7, ip: "127.0.0.1" },
        ],
      },
    ],
  });

  fs.mkdirSync(certsDir, { recursive: true });
  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);

  console.log("Generated self-signed dev certificate:");
  console.log(`  key:  ${keyPath}`);
  console.log(`  cert: ${certPath}`);
  console.log("Set in server/.env:");
  console.log("  HTTPS_KEY_PATH=certs/dev-key.pem");
  console.log("  HTTPS_CERT_PATH=certs/dev-cert.pem");
  console.log("Note: browsers/devices will show a trust warning — expected for dev.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
