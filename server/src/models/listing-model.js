"use strict";

const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title is too long (max 120 chars)"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description is too long (max 2000 chars)"],
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["textbooks", "furniture", "electronics", "other"],
    },
    photo: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "sold"],
      default: "active",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

listingSchema.index({ status: 1, category: 1, createdAt: -1 });

module.exports = mongoose.models.Listing || mongoose.model("Listing", listingSchema);
