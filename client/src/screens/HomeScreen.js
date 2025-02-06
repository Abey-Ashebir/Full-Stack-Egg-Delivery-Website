import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEggs } from "../actions/eggActions";
import Egg from "../components/Egg";
import { Grid, Container, Typography, CircularProgress, Alert } from "@mui/material";

export default function HomeScreen() {
  const dispatch = useDispatch();

  // Fetch the eggs data from Redux state
  const eggsState = useSelector((state) => state.eggReducer || {}); // Safeguard: fallback to an empty object
  const { eggs = [], error, loading } = eggsState; // Destructure with default values

  // Fetch eggs data on component mount
  useEffect(() => {
    dispatch(getAllEggs());
  }, [dispatch]);

  return (
    <Container sx={{ mt: 25 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}color="warning">
        Available Products
      </Typography>

      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : error ? (
        <Alert severity="error">Error: {error}</Alert>
      ) : eggs.length === 0 ? (
        <Typography variant="h6" align="center">No eggs available</Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
  {eggs.map((egg, index) => (
    <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
      <Egg egg={egg} />
    </Grid>
  ))}
</Grid>

      )}
    </Container>
  );
}
