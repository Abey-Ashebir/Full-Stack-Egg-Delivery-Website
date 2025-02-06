const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    orderItems: [
      {
        eggType: { type: String, required: true }, // Ensure "eggType" matches the data passed
        quantity: { type: Number, required: true, min: 1 }, // Quantity should be >= 1
        price: { type: Number, required: true, min: 0 }, // Price should be >= 0
        totalItemPrice: { type: Number, required: true, min: 0 }, // Ensure price is non-negative
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 }, // Total price should be >= 0
    paidAmount: { type: Number, default: 0, min: 0 }, // Add paidAmount field
    remainingAmount: { type: Number, default: 0 ,min:0},
    status: { type: String, default: "Pending", enum: ["Pending", "Delivered"] }, // Update status enum to match component
  },
  { timestamps: true }
);

// Create the Order model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;