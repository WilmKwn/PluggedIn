import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword, // Import this for email/password sign up
} from "firebase/auth";
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

  const handleSignUp = (event) => {
    event.preventDefault();
    // Use createUserWithEmailAndPassword for signing up new users
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Sign-up successful.
        // You can use userCredential.user to access the registered user's information
        const user = userCredential.user;
        localStorage.setItem("uid", user.uid);
        navigate("/onboarding"); // Redirect user after sign-up
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(
          "Error signing up with email and password:",
          errorCode,
          errorMessage
        );
        // Optionally, implement error handling or display error messages to the user
      });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>Sign Up</div>
      </header>

      <main className="landing">
        <form onSubmit={handleSignUp}>
          <input
            type="email" // Change this to email for semantic correctness
            placeholder="Email" // Adjusted placeholder to reflect it's expecting an email
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password" // Change this to password to hide the password input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
          <button type="button" onClick={signInWithGoogle}>
            Sign up with Google
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
