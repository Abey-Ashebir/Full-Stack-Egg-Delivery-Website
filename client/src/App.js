import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import OrderScreen from "./screens/OrderScreen";
import OrdersPage from "./pages/OrdersPage";
import AddProduct from "./pages/AddProduct";
import Footer from "./components/Footer";
import FeedbackScreens from "./screens/FeedbackScreens";
import AdminFeedback from "./components/AdminFeedback";
import AdminScreen from './screens/AdminScreen';

function App() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <main className="content">
          <Routes>
            <Route
              path="/"
              element={
                userInfo ? (
                  userInfo.isAdmin ? (
                    <AdminScreen />
                  ) : (
                    <HomeScreen />
                  )
                ) : (
                  <Navigate to="/register" replace />
                )
              }
            />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route
              path="/cart"
              element={
                userInfo ? <CartScreen /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/feedback"
              element={
                userInfo ? <FeedbackScreens /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/admin/feedback"
              element={
                userInfo && userInfo.isAdmin ? (
                  <AdminFeedback />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/order"
              element={
                userInfo ? <OrderScreen /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/add-product"
              element={
                userInfo ? <AddProduct /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/orders"
              element={
                userInfo ? <OrdersPage /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
