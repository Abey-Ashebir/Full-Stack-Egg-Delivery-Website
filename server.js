require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("./db"); // Import your database connection
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Import the User model
const EggVariant = require("./models/EggVariant"); // Import the EggVariant model
const Order = require("./models/Order"); // Import the Order model
const multer = require("multer");
const path = require("path");
const Product = require("./models/Product"); // Import the Product model
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.REACT_APP_API_URL || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json()); // JSON parsing middleware

const helmet = require("helmet");
app.use(helmet());
// Multer configuration for image upload
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create the uploads directory if it doesn't exist
const fs = require("fs");
const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const { cleanEnv, str, num } = require("envalid");

const env = cleanEnv(process.env, {
  JWT_SECRET: str(),
  PORT: num({ default: 5000 }),
  MONGO_URI: str(),
});

// Add Product Endpoint
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, variantType, price, quantity } = req.body;
    const image = req.file ? req.file.path : null;

    // Validate input
    if (!name || !variantType || !price || !quantity) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create a new product
    const newProduct = new Product({
      name,
      image,
      variantType,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({ success: true, message: "Product added successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add product", error: error.message });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("<h1>🥚 Abey Your Egg Delivery API is Running...</h1>");
});

// Fetch all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch orders from DB
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
  }
});
// Update an order
app.put("/api/orders/:id", async (req, res) => {
  try {

    const { id } = req.params; // Get _id from URL
    const { status, paidAmount } = req.body;

    if (!status || paidAmount === undefined) {
      return res.status(400).json({ message: "Status and paidAmount are required" });
    }

    // Find the order by _id
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Calculate remaining amount
    const remainingAmount = order.totalPrice - paidAmount;

    // Update order fields
    order.status = status;
    order.paidAmount = paidAmount;
    order.remainingAmount = remainingAmount;

    // Save the updated order
    await order.save();

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order details" });
  }
});





// Insert egg variants if none exist
async function insertEggVariants() {
  try {
    const count = await EggVariant.countDocuments();
    if (count === 0) {
      const eggVariants = [
        // Add predefined egg variants here if needed
      ];
      await EggVariant.insertMany(eggVariants);
    }
  } catch (err) {
  }
}

// Start the server only after the database connection is established
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");

  insertEggVariants(); // Insert default egg variants if needed

  // Fetch egg variants
  app.get("/api/geteggs", async (req, res) => {
    try {
      const eggs = await EggVariant.find({});
      if (eggs.length === 0) {
        res.status(404).send("No egg variants found.");
      } else {
        res.json(eggs);
      }
    } catch (err) {
      res.status(500).send("Error retrieving egg variants");
    }
  });

  // User Registration
  app.post("/api/users/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new User({ name, email, password });
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ message: "User registered successfully", token, user });
    } catch (error) {
      res.status(500).json({ message: "Registration failed", error: error.message });
    }
  });

  // Login User
  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

    

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  });

  // Order Submission Route
  app.post("/api/orders/submit", async (req, res) => {
    try {
      const { customerName, email, phone, address, orderItems, totalPrice } = req.body;

      if (!customerName || !email || !phone || !address || !orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newOrder = new Order({
        customerName,
        email,
        phone,
        address,
        orderItems,
        totalPrice,
        status: "Pending", // Default status
      });

      await newOrder.save();
      res.status(201).json({ message: "Order submitted successfully", order: newOrder });
    } catch (error) {
      res.status(500).json({ message: "Order submission failed", error: error.message });
    }
  });

  // Start Server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});
