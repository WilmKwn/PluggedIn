// SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import "../App.css"; // Make sure the path to your CSS file is correct

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful Google sign-in here
        navigate("/feed");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    // Handle sign-in with username and password here
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>Sign Up</div>
      </header>

      <main className="landing">
        <form onSubmit={handleSignIn}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
          <button type="button" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        </form>
      </main>

      <footer className="app-footer">
        <div>CS 307 Team 40</div>
      </footer>
    </div>
  );
};

export default SignUp;
