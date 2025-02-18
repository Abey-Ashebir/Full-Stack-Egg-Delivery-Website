// models/feedbackModel.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
