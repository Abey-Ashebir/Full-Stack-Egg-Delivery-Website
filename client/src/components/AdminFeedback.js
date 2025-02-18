import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/feedbacks");
        setFeedbacks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch feedback data.");
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/feedbacks/${id}`);
      console.log("Delete response:", response); // Debugging
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((feedback) => feedback._id !== id)
      );
    } catch (err) {
      console.error("Error deleting feedback:", err); // Debugging
      setError("Failed to delete feedback.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container  pt-5">
      <h2 className="text-center text-warning mb-4">Feedback Overview</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>User Name</th>
              <th>Phone</th>
              <th>Feedback</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback._id}>
                  <td>{feedback.name}</td>
                  <td>{feedback.phone}</td>
                  <td>{feedback.comment}</td>
                  <td>{feedback.rating}</td>
                  <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(feedback._id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No feedback available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}