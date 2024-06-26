// SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import axios from "axios";
import "../App.css"; // Make sure the path to your CSS file is correct
import "../SignInUp.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [invalidCredentialError, setInvalidCredentialError] = useState(false);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful Google sign-in here
        localStorage.setItem("userId", result.user.uid);
        localStorage.setItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying",
          result.user.uid
        );
        navigate("/feed");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        localStorage.setItem("userId", userCredential.user.uid);
        localStorage.setItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying",
          userCredential.user.uid
        );
        navigate("/feed");
      })
      .catch((error) => {
        const errorCode = error.code;
        // Check if the error code is auth/invalid-credential
        if (errorCode === "auth/invalid-credential") {
          // Set the state to true to display the error message
          setInvalidCredentialError(true);
        } else {
          // Handle other errors or reset the state as needed
          console.error("Error signing in:", errorCode, error.message);
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
        <div>Sign In</div>
      </header>

      <main className="landing">
      <form onSubmit={handleSignIn}>
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
  <button type="buttonSI" className="buttonSI standard-button">Sign In</button>
  <button type="buttonSI" onClick={signInWithGoogle} className="buttonSI google-button">
    Sign in with Google
</button>
  {invalidCredentialError && (
    <div className="error-message">Either wrong email or password</div>
  )}
  {invalidCredentialError && (
    <div className="error-message">
      otherwise, account already registered on google, sign in using google
    </div>
  )}
</form>
      </main>

      <footer className="app-footer">
        <div>CS 307 Team 40</div>
      </footer>
    </div>
  );
};

export default SignIn;
