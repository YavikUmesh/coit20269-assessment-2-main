import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";

process.env.NODE_ENV = "test";

const { default: createApp } = await import("../src/app.js");
const { connectDb, disconnectDb } = await import("../src/config/db.js");
const { default: User } = await import("../src/models/user-model.js");

const SIGNUP = "/api/users/signup";
const LOGIN = "/api/users/login";
const LOGOUT = "/api/users/logout";
const ME = "/api/users/me";

const validUser = {
  name: "Test Student",
  email: "student@cqu.edu.au",
  password: "password123",
  campus: "MEL",
};

let app;

beforeAll(async () => {
  await connectDb();
  app = createApp();
});

afterAll(async () => {
  await User.deleteMany({});
  await disconnectDb();
});

describe("POST /api/users/signup", () => {
  it("creates an account and returns token + public user", async () => {
    const res = await request(app).post(SIGNUP).send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user).toMatchObject({
      name: "Test Student",
      email: "student@cqu.edu.au",
      campus: "MEL",
    });
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it("rejects duplicate email with 409", async () => {
    const res = await request(app)
      .post(SIGNUP)
      .send({ ...validUser, name: "Other" });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toMatch(/already exists/i);
  });

  it("rejects missing fields with 400", async () => {
    const res = await request(app).post(SIGNUP).send({ email: "x@y.com" });

    expect(res.status).toBe(400);
  });

  it("rejects short passwords with 400", async () => {
    const res = await request(app)
      .post(SIGNUP)
      .send({ ...validUser, email: "short@cqu.edu.au", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/at least 8/i);
  });

  it("rejects invalid email with 400", async () => {
    const res = await request(app)
      .post(SIGNUP)
      .send({ ...validUser, email: "not-an-email" });

    expect(res.status).toBe(400);
  });

  it("stores a bcrypt hash, never the plain password", async () => {
    const user = await User.findOne({ email: validUser.email });
    expect(user.passwordHash).not.toBe(validUser.password);
    expect(user.passwordHash).toMatch(/^\$2[aby]\$/);
  });
});

describe("POST /api/users/login", () => {
  it("returns token + user for valid credentials", async () => {
    const res = await request(app)
      .post(LOGIN)
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.email).toBe(validUser.email);
  });

  it("401 with wrong password", async () => {
    const res = await request(app)
      .post(LOGIN)
      .send({ email: validUser.email, password: "wrong-password" });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Invalid email or password");
  });

  it("401 with unknown email — same message as wrong password", async () => {
    const res = await request(app)
      .post(LOGIN)
      .send({ email: "ghost@cqu.edu.au", password: "whatever123" });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Invalid email or password");
  });

  it("400 when fields are missing", async () => {
    const res = await request(app).post(LOGIN).send({ email: validUser.email });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/users/logout", () => {
  it("401 without a token", async () => {
    const res = await request(app).post(LOGOUT);

    expect(res.status).toBe(401);
  });

  it("200 with a valid token", async () => {
    let login = await request(app)
      .post(LOGIN)
      .send({ email: validUser.email, password: validUser.password });
    if (!login.body.data) {
      await request(app).post(SIGNUP).send(validUser);
      login = await request(app)
        .post(LOGIN)
        .send({ email: validUser.email, password: validUser.password });
    }

    const res = await request(app)
      .post(LOGOUT)
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe("Logged out");
  });
});

describe("GET /api/users/me", () => {
  it("returns the authenticated user profile", async () => {
    let login = await request(app)
      .post(LOGIN)
      .send({ email: validUser.email, password: validUser.password });
    if (!login.body.data) {
      await request(app).post(SIGNUP).send(validUser);
      login = await request(app)
        .post(LOGIN)
        .send({ email: validUser.email, password: validUser.password });
    }

    const res = await request(app).get(ME).set("Authorization", `Bearer ${login.body.data.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it("401 without a token", async () => {
    const res = await request(app).get(ME);
    expect(res.status).toBe(401);
  });
});
