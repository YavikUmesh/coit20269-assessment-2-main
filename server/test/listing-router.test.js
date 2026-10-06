import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";

process.env.NODE_ENV = "test";

const { default: createApp } = await import("../src/app.js");
const { connectDb, disconnectDb } = await import("../src/config/db.js");
const { default: User } = await import("../src/models/user-model.js");
const { default: Listing } = await import("../src/models/listing-model.js");

let app;
let sellerToken;
let otherToken;
let listingId;

const seller = { name: "Seller", email: "seller@test.cqu", password: "password123", campus: "MEL" };
const other = { name: "Other", email: "other@test.cqu", password: "password123", campus: "BNE" };

const validListing = {
  title: "Calculus textbook 9th ed",
  description: "Barely used, no highlighting",
  price: 45,
  category: "textbooks",
};

beforeAll(async () => {
  await connectDb();
  await User.deleteMany({});
  await Listing.deleteMany({});
  app = createApp();

  await request(app).post("/api/users/signup").send(seller);
  await request(app).post("/api/users/signup").send(other);

  const login = await request(app).post("/api/users/login").send({
    email: seller.email,
    password: seller.password,
  });
  sellerToken = login.body.data.token;

  const loginOther = await request(app).post("/api/users/login").send({
    email: other.email,
    password: other.password,
  });
  otherToken = loginOther.body.data.token;
});

afterAll(async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});
  await disconnectDb();
});

describe("POST /api/listings", () => {
  it("401 without a token", async () => {
    const res = await request(app).post("/api/listings").send(validListing);
    expect(res.status).toBe(401);
  });

  it("creates a listing with a valid token", async () => {
    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send(validListing);

    expect(res.status).toBe(201);
    expect(res.body.data.listing).toMatchObject({
      title: validListing.title,
      price: validListing.price,
      category: validListing.category,
      status: "active",
    });
    expect(typeof res.body.data.listing.seller).toBe("string"); // raw seller id on create
    listingId = res.body.data.listing._id;
  });

  it("400 on missing required fields", async () => {
    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ title: "No price or category" });

    expect(res.status).toBe(400);
  });

  it("400 on invalid category", async () => {
    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ ...validListing, category: "boats" });

    expect(res.status).toBe(400);
  });

  it("400 on negative price", async () => {
    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ ...validListing, price: -5 });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/listings (browse)", () => {
  it("is public and excludes sold listings by default", async () => {
    const res = await request(app).get("/api/listings");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.listings)).toBe(true);
    for (const l of res.body.data.listings) {
      expect(l.status).toBe("active");
    }
  });

  it("shows seller name/campus but not passwordHash", async () => {
    const res = await request(app).get("/api/listings");
    const listing = res.body.data.listings.find((l) => l._id === listingId);

    expect(listing.seller).toMatchObject({ name: "Seller", campus: "MEL" });
    expect(listing.seller.passwordHash).toBeUndefined();
  });

  it("filters by category", async () => {
    const res = await request(app).get("/api/listings?category=textbooks");
    for (const l of res.body.data.listings) {
      expect(l.category).toBe("textbooks");
    }
  });

  it("searches title/description with q", async () => {
    const res = await request(app).get("/api/listings?q=calculus");
    expect(res.body.data.listings.length).toBeGreaterThanOrEqual(1);
  });

  it("returns empty list for a category with no items", async () => {
    const res = await request(app).get("/api/listings?category=furniture");
    expect(res.status).toBe(200);
    expect(res.body.data.listings).toHaveLength(0);
  });
});

describe("GET /api/listings/:id", () => {
  it("returns the listing detail (public)", async () => {
    const res = await request(app).get(`/api/listings/${listingId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.listing.title).toBe(validListing.title);
    expect(res.body.data.listing.seller.name).toBe("Seller");
  });

  it("400 on malformed id", async () => {
    const res = await request(app).get("/api/listings/not-an-id");
    expect(res.status).toBe(400);
  });

  it("404 on unknown id", async () => {
    const res = await request(app).get("/api/listings/507f1f77bcf86cd799439011");
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/listings/:id", () => {
  it("401 without a token", async () => {
    const res = await request(app).put(`/api/listings/${listingId}`).send({ price: 40 });
    expect(res.status).toBe(401);
  });

  it("owner can update price and status", async () => {
    const res = await request(app)
      .put(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ price: 40, status: "sold" });

    expect(res.status).toBe(200);
    expect(res.body.data.listing.price).toBe(40);
    expect(res.body.data.listing.status).toBe("sold");
  });

  it("non-owner gets 403", async () => {
    const res = await request(app)
      .put(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ price: 1 });

    expect(res.status).toBe(403);
    expect(res.body.error.message).toMatch(/your own/i);
  });

  it("404 on unknown id", async () => {
    const res = await request(app)
      .put("/api/listings/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ price: 1 });

    expect(res.status).toBe(404);
  });

  it("sold listings excluded from default browse but visible with status=sold", async () => {
    const browse = await request(app).get("/api/listings");
    expect(browse.body.data.listings.find((l) => l._id === listingId)).toBeUndefined();

    const sold = await request(app).get("/api/listings?status=sold");
    expect(sold.body.data.listings.find((l) => l._id === listingId)).toBeTruthy();
  });
});

describe("DELETE /api/listings/:id", () => {
  it("non-owner gets 403", async () => {
    const res = await request(app)
      .delete(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it("owner deletes and the listing disappears", async () => {
    const res = await request(app)
      .delete(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.status).toBe(200);

    const gone = await request(app).get(`/api/listings/${listingId}`);
    expect(gone.status).toBe(404);
  });

  it("404 on already-deleted id", async () => {
    const res = await request(app)
      .delete(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.status).toBe(404);
  });
});
