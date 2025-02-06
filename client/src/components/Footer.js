import React from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import logo from '../assets/AfroFarming.jpg'
export default function Footer() {
  return (
    <footer className="footer mt-auto py-4 bg-dark text-white">
      <div className="container">
        <div className="row">
          {/* Contact Information */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                Adama, Oromia, Ethiopia
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                +251938104998
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                +251916586390              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                johnfekadu@gmail.com
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-4 d-flex flex-column align-items-center">
            <img
              src={logo}
              alt="Afro Farming Logo"
              className="rounded-circle mb-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <h3 className="text-warning">Afro Farming</h3>
          </div>

          {/* Location Map */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning">Our Location</h5>
            <h1>Adama</h1>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-4">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} By @Abey.
          </p>
        </div>
      </div>
    </footer>
  );
}