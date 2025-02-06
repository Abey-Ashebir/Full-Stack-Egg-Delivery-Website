const initialState = { eggs: [], loading: false, error: null };

export const eggReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_EGGS_REQUEST":
      return { ...state, loading: true };
    case "GET_EGGS_SUCCESS":
      return { ...state, loading: false, eggs: action.payload };
    case "GET_EGGS_FAILED":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
