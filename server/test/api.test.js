import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

// Import the app without starting the HTTPS/HTTP listener.
// app.js exports createApp(); index.js owns server startup.
process.env.NODE_ENV = "test";

const { default: createApp } = await import("../src/app.js");

describe("API skeleton", () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  it("GET /api/health returns ok status", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("ok");
    expect(res.body.data).toHaveProperty("uptime");
  });

  it("unknown route returns the standard error shape", async () => {
    const res = await request(app).get("/api/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual({
      message: "Not found: GET /api/does-not-exist",
      status: 404,
    });
  });

  it("malformed JSON body returns 400 in the standard error shape", async () => {
    const res = await request(app)
      .post("/api/echo")
      .set("Content-Type", "application/json")
      .send('{"broken":');

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty("message");
    expect(res.body.error.status).toBe(400);
  });
});
