import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "../App.css"; // Make sure the path to your CSS file is correct
import "../SignInUp.css";

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
  const handleBack = () => {
    window.history.back();
  };  
  return (
    <div className="app">
      <header className="app-header fixed-banner">
      <div>
            <button onClick={handleBack} className="button">
              <FontAwesomeIcon icon={faArrowLeftLong} /> <div>&nbsp;</div>Back
            </button>
          </div>
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
          <button type="buttonSI" className="buttonSI standard-button">Sign Up</button>
          <button type="buttonSI" onClick={signInWithGoogle} className="buttonSI google-button">
    Sign Up With Google
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
