import React, { useState } from "react";
import waterImage from "../assets/water1.jpg";
import milkImage from "../assets/milk2.jpg";
import { useDispatch } from "react-redux";
import { addToCart } from "../actions/cartActions";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import defaultEggImage from "../assets/eg.jpg";

export default function Egg({ egg }) {
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState(egg.variants[0]);
  const [quantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar

  const handleImageClick = () => {
    setOpenDialog(true);
  };

  const handleAddToCart = () => {
    const item = {
      id: egg.id,
      name: egg.name,
      variant: selectedVariant,
      quantity,
      price: egg.prices[selectedVariant],
      image: egg.images || defaultEggImage,
    };
    dispatch(addToCart(item)); // Add item to cart
    setOpenSnackbar(true); // Open the Snackbar
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false); // Close the Snackbar
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: 3,
        mt: 5,
      }}
    >
      {/* Egg Product */}
      <Card
        sx={{
          width: 280,
          padding: 2,
          borderRadius: 4,
          boxShadow: 3,
          transition: "transform 0.2s",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        <CardMedia
          component="img"
          height="250"
          image={egg.images || defaultEggImage}
          alt={egg.name}
          sx={{ borderRadius: 2, cursor: "pointer" }}
          onClick={handleImageClick}
        />
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "warning.main", mb: 2 }}
          >
            {egg.name}
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Choose Variant</InputLabel>
            <Select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              label="Choose Variant"
            >
              {egg.variants.map((variant, idx) => (
                <MenuItem key={idx} value={variant}>
                  {variant}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
          >
            Price: {egg.prices[selectedVariant] * quantity} ETB
          </Typography>

          <Button
            variant="contained"
            color="warning"
            fullWidth
            sx={{ borderRadius: 20, py: 1 }}
            onClick={handleAddToCart}
          >
            Add to Cart 🛒
          </Button>
        </CardContent>
      </Card>

      {/* Water Product */}
      <Card
        sx={{
          width: 280,
          padding: 2,
          borderRadius: 4,
          boxShadow: 3,
          transition: "transform 0.2s",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        <CardMedia
          component="img"
          height="250"
          image={waterImage}
          alt="Water"
          sx={{ borderRadius: 2, cursor: "pointer" }}
        />
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "warning.main", mb: 2 }}
          >
            Water
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
          >
            Price: Coming Soon
          </Typography>

          <Button
            variant="contained"
            color="warning"
            fullWidth
            sx={{ borderRadius: 20, py: 1 }}
            disabled
          >
            Add to Cart 🛒
          </Button>
        </CardContent>
      </Card>

      {/* Milk Product */}
      <Card
        sx={{
          width: 280,
          padding: 2,
          borderRadius: 4,
          boxShadow: 3,
          transition: "transform 0.2s",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        <CardMedia
          component="img"
          height="250"
          image={milkImage}
          alt="Milk"
          sx={{ borderRadius: 2, cursor: "pointer" }}
        />
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "warning.main", mb: 2 }}
          >
            Milk
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
          >
            Price: Coming Soon
          </Typography>

          <Button
            variant="contained"
            color="warning"
            fullWidth
            sx={{ borderRadius: 20, py: 1 }}
            disabled
          >
            Add to Cart 🛒
          </Button>
        </CardContent>
      </Card>

      {/* Image Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>{egg.name}</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={egg.images || defaultEggImage}
            alt={egg.name}
            sx={{ width: "100%", borderRadius: 2 }}
          />
          <Typography sx={{ mt: 2 }}>{egg.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Snackbar will close after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position of the Snackbar
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successfully added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
}