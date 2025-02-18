import { React, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateQuantity } from "../actions/cartActions"; // Import the new action

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
  Box,
  TextField,
} from "@mui/material";
import {  Delete } from "@mui/icons-material";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../actions/cartActions";

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.user?.userInfo || null);

  const handleIncreaseQuantity = (id) => {
    dispatch(increaseQuantity(id));
  };
 
  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity(id));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const [inputValues, setInputValues] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );

  const handleQuantityChange = (id, value) => {
    if (value === "") {
      // Allow empty field but do not update Redux yet
      setInputValues((prev) => ({ ...prev, [id]: "" }));
      return;
    }

    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      setInputValues((prev) => ({ ...prev, [id]: quantity }));
      dispatch(updateQuantity(id, quantity));
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "warning.main" }}
      >
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Variant</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 50, height: 50, marginRight: 10 }}
                        />
                        <Typography variant="body1">{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.variant}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDecreaseQuantity(item.id)}
                      >
                      </IconButton>
                      <TextField
                        type="number"
                        value={inputValues[item.id] ?? item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        inputProps={{ min: 1 }}
                        sx={{ width: 60, textAlign: "center" }}
                      />

                      <IconButton
                        onClick={() => handleIncreaseQuantity(item.id)}
                      >
                      </IconButton>
                    </TableCell>
                    <TableCell>{item.price} ETB</TableCell>
                    <TableCell>{item.price * item.quantity} ETB</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleRemoveFromCart(item.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Total Price:
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {totalPrice} ETB
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button
              variant="contained"
              color="warning"
              onClick={() =>
                navigate("/order", {
                  state: { cartItems, userInfo },
                })
              }
            >
              Proceed to Delivery
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
