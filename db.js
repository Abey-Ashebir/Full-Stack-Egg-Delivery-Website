const mongoose = require("mongoose");

// Load environment variables
require("dotenv").config();

// MongoDB connection string (use environment variables for security)
const uri = process.env.MONGO_URI || "mongodb+srv://abeyashebir:pOv4fI2dlf4j4UnM@cluster0.mryt6.mongodb.net/jo_agri?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(uri, {
    // Remove deprecated options (useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+)
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  });

// Export the mongoose connection
module.exports = mongoose;