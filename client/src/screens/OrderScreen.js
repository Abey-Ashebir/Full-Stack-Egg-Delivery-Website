import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  List,
  ListItem,
  Snackbar,
  Alert,
} from "@mui/material";

export default function OrderScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get userInfo from location state or localStorage
  const userInfo = location.state?.userInfo || JSON.parse(localStorage.getItem("userInfo")) || null;
  const cartItems = location.state?.cartItems || [];

  // Initialize form data with user info
  const [formData, setFormData] = useState({
    username: userInfo?.username || "",
    phoneNumber: userInfo?.phoneNumber || "",
    location: "",
  });

  const [error, setError] = useState("");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Ensure default values for calculations
  const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0)
    .toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const orderData = {
      customerName: formData.username || "Guest",
      email: userInfo?.email || "default_email@example.com", // Provide a default email if missing
      phone: formData.phoneNumber,
      address: formData.location,
      orderItems: cartItems.map((item) => ({
        eggType: item.eggType || "Unknown",
        quantity: item.quantity || 0,
        price: item.price || 0,
        totalItemPrice: ((item.price || 0) * (item.quantity || 0)).toFixed(2),
      })),
      totalPrice,
    };

    // Validate form and cart items
    if (!orderData.orderItems.length || !formData.username || !formData.phoneNumber || !formData.location) {
      setError("All fields are required, and the order must have items.");
      setSnackbarMessage("All fields are required, and the order must have items.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to place order. Please check your details and try again.");
        setSnackbarMessage(data.message || "Failed to place order. Please check your details and try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Success: Show snackbar and navigate to home
      setSnackbarMessage("Order placed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/");
      }, 2000); // Navigate after 2 seconds
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Network error. Please check your connection and try again.");
      setSnackbarMessage("Network error. Please check your connection and try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 15 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "orange" }}>
          Order Details
        </Typography>

        {/* Display cart items */}
        <Typography variant="h6" sx={{ mb: 2 }}>Items in Cart:</Typography>
        {cartItems.length === 0 ? (
          <Typography variant="body1" sx={{ color: "red" }}>Your cart is empty!</Typography>
        ) : (
          <List>
            {cartItems.map((item, index) => (
              <ListItem key={index}>
                <Typography>
                  {item.eggType} - {item.quantity} Eggs x {item.price} ETB = {(item.quantity * item.price).toFixed(2)} ETB
                </Typography>
              </ListItem>
            ))}
          </List>
        )}

        {/* Show total quantity and price */}
        <Typography variant="h6" sx={{ mt: 3 }}>Total Eggs: {totalQuantity} </Typography>
        <Typography variant="h6" sx={{ color: "warning.main" }}>Total Price: {totalPrice} ETB</Typography>

        {error && (
          <Typography variant="body2" sx={{ color: "red", mt: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button type="submit" variant="contained" color="warning" sx={{ mt: 3 }}>
            Place Order
          </Button>
        </form>
      </Paper>

      {/* Snackbar for showing messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}