import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";

process.env.NODE_ENV = "test";

const { default: authenticate } = await import("../src/middleware/authenticate.js");
const { notFound, errorHandler } = await import("../src/middleware/error-handler.js");
const { connectDb, disconnectDb } = await import("../src/config/db.js");
const { default: User } = await import("../src/models/user-model.js");

// Probe app: same middleware stack as app.js, with the auth middleware
// mounted on a test route so we can exercise it through real HTTP
// requests without touching real routers.
function probeApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/probe/whoami", authenticate, (req, res) => {
    res.json({ data: { user: req.user } });
  });
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

describe("authenticate middleware", () => {
  const app = probeApp();
  const secret = process.env.JWT_SECRET;

  const sign = (payload) => jwt.sign(payload, secret, { expiresIn: "1h" });

  let dbUser;
  beforeAll(async () => {
    await connectDb();
    // The jwt strategy loads the user from the DB — use a real user.
    dbUser = await User.create({
      name: "Probe User",
      email: "probe@test.cqu",
      passwordHash: "x", // never compared here
    });
  });

  afterAll(async () => {
    await User.deleteOne({ _id: dbUser?._id });
    await disconnectDb();
  });

  it("401 when no Authorization header is sent", async () => {
    const res = await request(app).get("/probe/whoami");

    expect(res.status).toBe(401);
    expect(res.body.error).toEqual({
      message: "Authentication required",
      status: 401,
    });
  });

  it("401 when the scheme is not Bearer", async () => {
    const res = await request(app)
      .get("/probe/whoami")
      .set("Authorization", `Basic ${sign({ sub: "1" })}`);

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Authentication required");
  });

  it("401 on an invalid token", async () => {
    const res = await request(app)
      .get("/probe/whoami")
      .set("Authorization", "Bearer not-a-real-token");

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Invalid or expired token");
  });

  it("401 on a token signed with the wrong secret", async () => {
    const forged = jwt.sign({ sub: "1", email: "x@test.com" }, "wrong-secret");
    const res = await request(app).get("/probe/whoami").set("Authorization", `Bearer ${forged}`);

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Invalid or expired token");
  });

  it("populates req.user (full db doc) and returns 200 for a valid token", async () => {
    const token = sign({ sub: dbUser._id.toString(), email: dbUser.email });
    const res = await request(app).get("/probe/whoami").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("probe@test.cqu");
    expect(res.body.data.user.passwordHash).toBeUndefined(); // strategy strips the hash
  });
});
