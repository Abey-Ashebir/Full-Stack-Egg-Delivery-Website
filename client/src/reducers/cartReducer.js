import { 
  ADD_TO_CART, 
  INCREASE_QUANTITY, 
  DECREASE_QUANTITY, 
  REMOVE_FROM_CART,
  UPDATE_QUANTITY
} from '../actions/cartActions';

// Load cart items from localStorage
const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartReducer = (state = initialState, action) => {
  let updatedCartItems;

  switch (action.type) {
    case ADD_TO_CART:
      // Ensure uniqueness (combine id + variant if applicable)
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id && item.variant === action.payload.variant
      );

      if (existingItem) {
        // If the item already exists, update the quantity
        updatedCartItems = state.cartItems.map((item) =>
          item.id === action.payload.id && item.variant === action.payload.variant
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add the new item
        updatedCartItems = [...state.cartItems, { ...action.payload, quantity: 1 }];
      }
      break;

    case INCREASE_QUANTITY:
      updatedCartItems = state.cartItems.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      break;

    case DECREASE_QUANTITY:
      updatedCartItems = state.cartItems.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) } // Ensure quantity doesn't go below 1
          : item
      );
      break;

    case UPDATE_QUANTITY:
      updatedCartItems = state.cartItems.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      break;

    case REMOVE_FROM_CART:
      updatedCartItems = state.cartItems.filter((item) => item.id !== action.payload);
      break;

    default:
      return state;
  }

  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Save updated cart state
  return { ...state, cartItems: updatedCartItems };
};

export default cartReducer;
