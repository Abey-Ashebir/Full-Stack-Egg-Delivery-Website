import { createStore, combineReducers, applyMiddleware } from "redux";
import  thunk  from "redux-thunk";
import { eggReducer } from "./reducers/eggReducer";
import cartReducer from "./reducers/cartReducer";
import { userRegisterReducer, userLoginReducer } from "./reducers/userReducers";

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  eggReducer: eggReducer,
  cart: cartReducer,
  userRegister: userRegisterReducer,
  userLogin: userLoginReducer,
});

// Get user info from local storage if available
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Initial state including user login state
const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

// Create the Redux store with the root reducer and apply middleware (thunk)
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk)
);

export default store;