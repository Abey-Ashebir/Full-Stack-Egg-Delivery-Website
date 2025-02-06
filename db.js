const mongoose = require("mongoose");

// MongoDB connection string (use your credentials)
const uri = "mongodb+srv://abeyashebir:pOv4fI2dlf4j4UnM@cluster0.mryt6.mongodb.net/jo_agri?retryWrites=true&w=majority";

// Connect to MongoDB (removing deprecated options)
mongoose.connect(uri, {
  // Remove deprecated options
  // You don't need useNewUrlParser and useUnifiedTopology in MongoDB 4.x+
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

module.exports = mongoose; // Export the mongoose connection
