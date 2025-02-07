import React, { useState } from "react";
import { Button, Form, Card, Container, Row, Col } from "react-bootstrap";

const AddProduct = ({ onProductAdded }) => {
  const [productName, setProductName] = useState("");
  const [image, setImage] = useState(null);
  const [variantType, setVariantType] = useState("Habesha");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleAddToCart = async () => {
    if (!productName || !price || !quantity) {
      setError("Please fill in all fields");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be a positive number");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("variantType", variantType);
    formData.append("price", price);
    formData.append("quantity", quantity);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("https://back-zkj8.onrender.com/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Product added successfully:", data);
        alert(data.message || "Product added successfully!");
        // Reset the form
        setProductName("");
        setImage(null);
        setVariantType("Habesha");
        setPrice(0);
        setQuantity(1);
        setError("");
        // Pass the added product data to the parent component
        onProductAdded(data.product);
      } else {
        console.error("Failed to add product:", data);
        setError(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while adding the product");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="text-center mb-4" >Add Product</Card.Title>
              {error && <div className="alert alert-danger">{error}</div>}
              <Form>
                {/* Form fields */}
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Product Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {image && (
                    <div className="mt-2 text-center">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Product Preview"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Variant Type</Form.Label>
                  <Form.Select
                    value={variantType}
                    onChange={(e) => setVariantType(e.target.value)}
                  >
                    <option value="Habesha">Habesha</option>
                    <option value="Foreign">Foreign</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price (ETB)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, e.target.value))}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0, e.target.value))}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="warning"
                    className="rounded-pill"
                    onClick={handleAddToCart}
                  >
                    Add Product
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;