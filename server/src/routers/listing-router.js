"use strict";

const express = require("express");
const mongoose = require("mongoose");

const Listing = require("../models/listing-model");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const CATEGORIES = ["textbooks", "furniture", "electronics", "other"];

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/listings — browse (public), filters: category, status, q, mine=1
router.get("/", async (req, res, next) => {
  try {
    const query = {};

    // Default: hide sold items unless explicitly asked for them
    if (req.query.status === "sold" || req.query.status === "active") {
      query.status = req.query.status;
    } else {
      query.status = "active";
    }

    if (req.query.category && CATEGORIES.includes(req.query.category)) {
      query.category = req.query.category;
    }

    if (req.query.q) {
      const q = String(req.query.q).trim();
      if (q) {
        query.$or = [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ];
      }
    }

    // Authenticated users can list their own listings (active AND sold)
    if (req.query.mine === "1") {
      if (!req.headers.authorization) {
        return res.status(401).json({
          error: { message: "Authentication required", status: 401 },
        });
      }
    }

    const mine = req.query.mine === "1";
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);

    let findQuery = Listing.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    if (mine) {
      // Authenticate lazily only when mine=1 (public browse stays public)
      return authenticate(req, res, async (err) => {
        if (err) return next(err);
        findQuery = Listing.find({ ...query, seller: req.user.id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
        const listings = await findQuery;
        return res.json({ data: { listings } });
      });
    }

    const listings = await findQuery.populate("seller", "name campus");
    return res.json({ data: { listings } });
  } catch (err) {
    return next(err);
  }
});

// GET /api/listings/:id — detail (public)
router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: { message: "Invalid listing id", status: 400 },
      });
    }

    const listing = await Listing.findById(req.params.id).populate("seller", "name campus");
    if (!listing) {
      return res.status(404).json({
        error: { message: "Listing not found", status: 404 },
      });
    }

    return res.json({ data: { listing } });
  } catch (err) {
    return next(err);
  }
});

// POST /api/listings — create (auth required)
router.post("/", authenticate, async (req, res, next) => {
  try {
    const { title, description, price, category, photo } = req.body || {};

    if (!title || price === undefined || !category) {
      return res.status(400).json({
        error: { message: "Title, price and category are required", status: 400 },
      });
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      photo,
      seller: req.user.id,
    });

    return res.status(201).json({ data: { listing } });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: { message: Object.values(err.errors)[0].message, status: 400 },
      });
    }
    return next(err);
  }
});

// PUT /api/listings/:id — update (auth required, owner only)
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: { message: "Invalid listing id", status: 400 },
      });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        error: { message: "Listing not found", status: 404 },
      });
    }

    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        error: { message: "You can only edit your own listings", status: 403 },
      });
    }

    const allowed = ["title", "description", "price", "category", "photo", "status"];
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    }

    await listing.save();
    return res.json({ data: { listing } });
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({
        error: { message: err.message, status: 400 },
      });
    }
    return next(err);
  }
});

// DELETE /api/listings/:id — delete (auth required, owner only)
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: { message: "Invalid listing id", status: 400 },
      });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        error: { message: "Listing not found", status: 404 },
      });
    }

    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        error: { message: "You can only delete your own listings", status: 403 },
      });
    }

    await listing.deleteOne();
    return res.json({ data: { message: "Listing deleted" } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
