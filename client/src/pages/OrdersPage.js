import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  Box,
} from "@mui/material";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [editedPaidAmounts, setEditedPaidAmounts] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchOrders = useCallback(async () => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://afrofarm.onrender.com/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to fetch orders");
      }

      const data = await response.json();
      const sortedOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleEditClick = (orderId, currentStatus, currentPaidAmount) => {
    setEditingOrderId(orderId);
    setEditedStatus(currentStatus);
    setEditedPaidAmounts((prev) => ({
      ...prev,
      [orderId]: currentPaidAmount,
    }));
  };

  const handleSaveClick = async (id) => {
    const paidAmount = editedPaidAmounts[id] || 0;

    try {
      const response = await fetch(`https://afrofarm.onrender.com/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          status: editedStatus,
          paidAmount: paidAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order details");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id
            ? { ...order, status: editedStatus, paidAmount: paidAmount, remainingAmount: order.totalPrice - paidAmount }
            : order
        )
      );

      setEditingOrderId(null);
      setSnackbarMessage("Order updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPhoneNumber = (phone) => {
    return phone.replace(/[^0-9]/g, "");
  };

  const calculateRemainingAmount = (totalPrice, paidAmount) => {
    return totalPrice - paidAmount;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 15 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
          All Orders
        </Typography>
        <Button
          variant="contained"
          color="warning"
          onClick={() => navigate("/add-product")}
          sx={{
            fontSize: { xs: "12px", md: "16px" },
            padding: { xs: "6px 12px", md: "8px 16px" },
            mt: { xs: 2, md: 0 },
          }}
        >
          Add Product
        </Button>
      </Box>

      <TextField
        label="Search Customer Name"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, width: "100%" }}
      />

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ border: "1px solid #ddd" }}>Customer Name</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Phone Number</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Location</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Quantity</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Total Price</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Paid Amount</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Remaining Amount</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Status</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell sx={{ border: "1px solid #ddd" }}>{order.customerName}</TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    <a
                      href={`tel:${formatPhoneNumber(order.phone)}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {order.phone}
                    </a>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>{order.address}</TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
        {order.orderItems.reduce((total, item) => total + item.quantity, 0)}
      </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    ${order.totalPrice}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {editingOrderId === order._id ? (
                      <TextField
                        value={editedPaidAmounts[order._id] || 0}
                        onChange={(e) =>
                          setEditedPaidAmounts((prev) => ({
                            ...prev,
                            [order._id]: Number(e.target.value),
                          }))
                        }
                        size="small"
                        type="number"
                      />
                    ) : (
                      `$${order.paidAmount || 0}`
                    )}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    ${calculateRemainingAmount(order.totalPrice, editedPaidAmounts[order._id] || order.paidAmount || 0)}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #ddd",
                      color: order.status === "Delivered" ? "red" : "green",
                    }}
                  >
                    {editingOrderId === order._id ? (
                      <Select
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        size="small"
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                      </Select>
                    ) : (
                      order.status
                    )}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {editingOrderId === order._id ? (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleSaveClick(order._id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() =>
                          handleEditClick(order._id, order.status, order.paidAmount || 0)
                        }
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};


export default OrdersPage;