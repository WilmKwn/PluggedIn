import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "../App.css"; // Make sure the path to your CSS file is correct

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold the error message

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful Google sign-in here
        navigate("/feed");
      })
      .catch((error) => {
        // Set custom error message based on error code
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("Already Registered");
        } else {
          setErrorMessage(error.message);
        }
      });
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Sign-up successful.
        navigate("/onboarding"); // Redirect user after sign-up
      })
      .catch((error) => {
        // Set custom error message based on error code
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("Already Registered");
        } else {
          setErrorMessage(error.message);
        }
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
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
          <button type="button" onClick={signInWithGoogle}>
            Sign up with Google
          </button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </main>

      <footer className="app-footer">
        <div>CS 307 Team 40</div>
      </footer>
    </div>
  );
};

export default SignUp;
