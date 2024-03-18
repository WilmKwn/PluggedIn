import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import SecondaryBanner from "./SecondaryBanner";
import SecondaryBottomBar from "./SecondaryBottomBar";
import "../App.css";
import "../index.css";

const Settings = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleSubmit = () => {
    // Implement your submission logic here
    // For this example, let's just log the email and password
    console.log("Email:", email);
    console.log("Password:", password);
  };

  // Delete does not work in backend

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your Account?")) {
      // User clicked OK, perform the delete operation
      console.log("Deleting user with ID:", userId);
      axios.delete(`http://localhost:5001/user/${userId}`)
        .then(navigate("/"))
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  return (
    <div>
      <SecondaryBanner />
      <div className="settings-container">
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h1 style={{ fontWeight: "bold" }}>User's Full Name</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "5px" }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handleSubmit} style={{ padding: "10px 20px", fontSize: "16px" }}>Submit</button>
        </div>
        <div>
          <button className="delete-button" onClick={handleDelete}>Delete Account</button>
        </div>
      </div>
      <SecondaryBottomBar />
    </div>
  );
};

export default Settings;
