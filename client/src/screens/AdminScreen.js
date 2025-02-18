import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap"; // Using React-Bootstrap
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons

const AdminScreen = () => {
  return (
    <Container fluid className="p-0">
      <Row>
        {/* Sidebar */}
        <Col
          md={2}
          className="bg-dark text-white vh-100 p-3 d-none d-md-block sidebar"
        >
          <h4 className="text-center mb-4">Admin Panel</h4>
          <ul className="list-unstyled">
            <li className="mb-3">
              <Link to="#" className="text-white text-decoration-none">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/admin/feedback"
                className="text-white text-decoration-none"
              >
                <i className="bi bi-chat-left-text me-2"></i>Feedback
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/orders" className="text-white text-decoration-none">
                <i className="bi bi-cart-check me-2"></i>Orders
              </Link>
            </li>
          </ul>
        </Col>

        {/* Main Content */}
        <Col md={10} className="ms-sm-auto px-4 py-4">
          <h2 className="text-primary mb-4">Welcome, Admin!</h2>
          <p>Manage your application from here.</p>

          {/* Quick Stats Cards */}
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <Card className="shadow border-0">
                <Card.Body className="text-center">
                  <i className="bi bi-cart-check fs-1 text-primary mb-3"></i>
                  <h5>Total Orders</h5>
                  <p className="text-muted">***</p>
                  <Button variant="primary" as={Link} to="/orders">
                    View Orders
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="shadow border-0">
                <Card.Body className="text-center">
                  <i className="bi bi-chat-left-text fs-1 text-success mb-3"></i>
                  <h5>Total Feedback</h5>
                  <p className="text-muted">***</p>
                  <Button variant="success" as={Link} to="/admin/feedback">
                    View Feedback
                  </Button>{" "}
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="shadow border-0">
                <Card.Body className="text-center">
                  <i className="bi bi-box-seam fs-1 text-info mb-3"></i>
                  <h5>Total Products</h5>
                  <p className="text-muted">***</p>
                  <Button variant="info" className="text-white">
                    Manage Products
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminScreen;
