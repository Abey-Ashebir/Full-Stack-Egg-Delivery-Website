import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { FaSmile, FaFrown, FaMeh } from "react-icons/fa";
import axios from "axios";

export default function FeedbackScreens() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !comment || !rating) {
      setError("Please fill all fields and select a rating.");
      return;
    }
    try {
        await axios.post("http://localhost:5000/api/feedback", {
            name,
            phone,
            comment,
            rating,
          });
      setSuccess("Thank you for your feedback!");
      setError("");
      setName("");
      setPhone("");
      setComment("");
      setRating("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Container className="my-5 ">
      <h1 className="text-center mb-4  fw-bold text-warning">Feedback</h1>
      <p className="text-center mb-4 text-muted">
        We value your feedback! Please share your experience with us.
      </p>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit} className="p-4 bg-light rounded-3 shadow-sm">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-3 p-2"
                style={{
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label className="fw-bold">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="rounded-3 p-2"
                style={{
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="comment">
          <Form.Label className="fw-bold">Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter your feedback or comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="rounded-3 p-2"
            style={{
              border: "1px solid #ddd",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="rating">
          <Form.Label className="fw-bold">How was your experience?</Form.Label>
          <div className="d-flex justify-content-around">
            <Button
              variant={rating === "happy" ? "success" : "outline-success"}
              onClick={() => setRating("happy")}
              aria-label="Happy"
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow:
                  rating === "happy" ? "0 4px 8px rgba(0,0,0,0.2)" : "none",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <FaSmile size={30} />
            </Button>
            <Button
              variant={rating === "neutral" ? "warning" : "outline-warning"}
              onClick={() => setRating("neutral")}
              aria-label="Neutral"
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow:
                  rating === "neutral" ? "0 4px 8px rgba(0,0,0,0.2)" : "none",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <FaMeh size={30} />
            </Button>
            <Button
              variant={rating === "sad" ? "danger" : "outline-danger"}
              onClick={() => setRating("sad")}
              aria-label="Sad"
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow:
                  rating === "sad" ? "0 4px 8px rgba(0,0,0,0.2)" : "none",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <FaFrown size={30} />
            </Button>
          </div>
        </Form.Group>

        <div className="text-center">
          <Button
            variant="warning"
            type="submit"
            className="mt-3 px-4 fw-bold text-white"
            style={{
              borderRadius: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            Submit Feedback
          </Button>
        </div>
      </Form>
    </Container>
  );
}