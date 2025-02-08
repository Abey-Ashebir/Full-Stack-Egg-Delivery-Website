import axios from "axios";
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "../constants/userConstants";

// Register User
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Send registration data to backend
    const { data } = await axios.post("https://afrofarm.onrender.com/api/users/register", userData, config);

    if (!data || !data.token) {
      throw new Error("Registration failed: No token received");
    }

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });

    // Save user info in localStorage
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    console.error("Registration error:", error);
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Login User
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("https://afrofarm.onrender.com/api/users/login", { email, password }, config);
    console.log("Login response:", data); // Log the response

    if (!data || !data.token) {
      throw new Error("Login failed: No token received");
    }

    // Ensure isAdmin is included in the payload
    const userInfo = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      isAdmin: data.user.isAdmin,
      token: data.token,
    };

    dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfo });
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  } catch (error) {
    console.error("Login error:", error);
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || "Invalid email or password",
    });
  }
};

// Logout User
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("userInfo"); // Clear user info from localStorage
  dispatch({ type: USER_LOGOUT }); // Dispatch logout action
};