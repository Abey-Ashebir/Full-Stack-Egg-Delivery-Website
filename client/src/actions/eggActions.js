export const getAllEggs = () => async (dispatch) => {
  dispatch({ type: "GET_EGGS_REQUEST" });
  try {
    const response = await fetch("https://back-zkj8.onrender.com/api/geteggs");
    const data = await response.json();
    dispatch({ type: "GET_EGGS_SUCCESS", payload: Array.isArray(data) ? data : [data] });
  } catch (error) {
    dispatch({ type: "GET_EGGS_FAILED", payload: error.message });
  }
};
