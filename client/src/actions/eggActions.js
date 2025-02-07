export const getAllEggs = () => async (dispatch) => {
  dispatch({ type: "GET_EGGS_REQUEST" });
  try {
    const response = await fetch("http://localhost:5000/api/geteggs");
    const data = await response.json();
    dispatch({ type: "GET_EGGS_SUCCESS", payload: Array.isArray(data) ? data : [data] });
  } catch (error) {
    dispatch({ type: "GET_EGGS_FAILED", payload: error.message });
  }
};
