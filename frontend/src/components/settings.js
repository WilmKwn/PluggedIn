import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import SecondaryBanner from "./SecondaryBanner";
import SecondaryBottomBar from "./SecondaryBottomBar";
import "../App.css";
import "../index.css";

const Settings = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Implement your submission logic here
    // For this example, let's just log the email and password
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div>
      <SecondaryBanner />
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
      <SecondaryBottomBar />
    </div>
  );
};

export default Settings;
