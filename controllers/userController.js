import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Login User (WITHOUT Hashing - NOT RECOMMENDED)
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login request received for:", email);

  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    console.log("User not found");
    res.status(401);
    throw new Error("Invalid email or password");
  }

  console.log("User found:", user.email);

  // ✅ Compare plain text password directly
  if (user.password === password) {
    console.log("Password matched, logging in user...");

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin, // Include isAdmin in the response
      token: generateToken(user._id),
    });
  } else {
    console.log("Password mismatch");
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Register User (WITHOUT Hashing - NOT RECOMMENDED)
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Registering new user:", email);

  const userExists = await User.findOne({ email });

  if (userExists) {
    console.log("User already exists");
    res.status(400);
    throw new Error("User already exists");
  }

  try {
    // ✅ Save user with plain text password (Highly Insecure)
    const user = await User.create({
      name,
      email,
      password,
    });

    console.log("User registered successfully:", user.email);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400);
    throw new Error("Invalid user data");
  }
});
