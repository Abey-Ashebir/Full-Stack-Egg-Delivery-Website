import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../actions/userActions";
import { FaUserCircle } from "react-icons/fa"; // User Icon (FontAwesome)
import logo from "../assets/AfroFarming.jpg"; // Import the logo
import "../App.css";

export default function Navbar() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { userInfo } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const dropdownRef = useRef(null);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAdmin = userInfo?.isAdmin || false;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark py-3 fixed-top"
      style={{ background: "linear-gradient(to right, #000000, #434343)" }}
    >
      <div className="container">
        {/* Brand Logo */}
        <a className="navbar-brand fw-bold text-warning fs-4" href="/">
          <img src={logo} alt="Afro Farming Logo" className="navbar-logo" />
          AFRO FARMING
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <a className="nav-link fw-bold text-warning fs-5" href="/cart">
                🛒 Cart ({cartItems.length})
              </a>
            </li>

            {userInfo ? (
              <li className="nav-item dropdown" ref={dropdownRef}>
                <button
                  className="nav-link d-flex flex-column align-items-center"
                  onClick={toggleUserInfo}
                  aria-label="User Info"
                  style={{ background: "none", border: "none" }}
                >
                  <FaUserCircle size={28} className="me-2" />
                  <span className="d-sm-inline fw-bold text-warning" >{userInfo.name}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserInfo && (
                  <div
                    className="dropdown-menu show user-dropdown"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      zIndex: 1000,
                    }}
                  >
                    {isAdmin && (
                      <a className="dropdown-item" href="/orders">
                        Orders
                      </a>
                    )}
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-warning fw-bold px-4 rounded-pill shadow-sm"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
