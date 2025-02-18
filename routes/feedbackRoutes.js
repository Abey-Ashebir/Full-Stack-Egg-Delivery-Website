// routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedbackModel");

// POST Feedback
router.post("/", async (req, res) => {
  const { name, phone, comment, rating } = req.body;

  try {
    const feedback = new Feedback({
      name,
      phone,
      comment,
      rating,
    });
    await feedback.save();
    res.status(201).json({ message: "Feedback saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE feedback by ID
router.delete("/:id", async (req, res) => {
  console.log("Delete request received for ID:", req.params.id);
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      console.log("Feedback not found");
      return res.status(404).json({ message: "Feedback not found" });
    }
    console.log("Feedback deleted successfully");
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
