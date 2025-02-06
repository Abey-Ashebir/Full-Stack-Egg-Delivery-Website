const mongoose = require("mongoose");

// Define Schema for EggVariant
const eggVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  variants: { type: [String], required: true },
  prices: {
    Habesha: { type: Number, required: true },
    Foreign: { type: Number, required: true },
  },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });  // Optional: Adds createdAt and updatedAt fields

// Create Model from Schema
const EggVariant = mongoose.model("EggVariant", eggVariantSchema);

module.exports = EggVariant;
