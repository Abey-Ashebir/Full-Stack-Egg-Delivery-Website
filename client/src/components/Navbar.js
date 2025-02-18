import React, { useState, useRef,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../actions/userActions";
import {
  FaUserCircle,
  FaShoppingCart,
  FaCommentDots,
  FaSignInAlt,
} from "react-icons/fa";
import logo from "../assets/AfroFarming.jpg";
import "../App.css";
import { resetCart } from "../actions/cartActions";

export default function Navbar() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { userInfo } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false); // Track navbar expansion
  const dropdownRef = useRef(null);

  // Add/remove class to body when navbar is expanded
  useEffect(() => {
    if (isNavExpanded) {
      document.body.classList.add("navbar-expanded");
    } else {
      document.body.classList.remove("navbar-expanded");
    }
  }, [isNavExpanded]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(resetCart());
    dispatch(logoutUser());
    localStorage.removeItem("cart");
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
        <a
          className="navbar-brand fw-bold text-warning fs-4 d-flex align-items-center"
          href="/"
        >
          <img src={logo} alt="Afro Farming Logo" className="navbar-logo me-2" />
          AFRO FARMING
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavExpanded(!isNavExpanded)} // Toggle navbar expansion
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div
          className={`collapse navbar-collapse ${isNavExpanded ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <a
                className="nav-link fw-bold text-warning fs-5 d-flex align-items-center"
                href={isAdmin ? "/admin/feedback" : "/feedback"}
              >
                <FaCommentDots className="me-2" />{" "}
                {isAdmin ? "See Feedback" : "Feedback"}
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link fw-bold text-warning fs-5 d-flex align-items-center"
                href="/cart"
              >
                <FaShoppingCart className="me-2" /> Cart ({cartItems.length})
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
                  <span className="d-sm-inline fw-bold text-warning">
                    {userInfo.name}
                  </span>
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
                  className="btn btn-warning fw-bold px-4 rounded-pill shadow-sm d-flex align-items-center"
                  onClick={handleLoginClick}
                >
                  <FaSignInAlt className="me-2" /> Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}