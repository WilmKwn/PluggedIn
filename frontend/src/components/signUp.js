import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
<<<<<<< Updated upstream
  createUserWithEmailAndPassword, // Import this for email/password sign up
} from "firebase/auth";
import axios from "axios";
import "../App.css"; // Make sure the path to your CSS file is correct
=======
  createUserWithEmailAndPassword,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "./firebase";

import "../App.css";
>>>>>>> Stashed changes

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< Updated upstream
=======
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationId, setVerificationId] = useState(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        },
        auth
      );
      window.recaptchaVerifier.render();
    }
  }, []);
>>>>>>> Stashed changes

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
<<<<<<< Updated upstream
      .then((result) => {
        // Handle successful Google sign-in here

        localStorage.setItem("userId", result.user.uid);
        localStorage.setItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying",
          result.user.uid
        );

        navigate("/onboarding");
      })
      .catch((error) => {
        console.error(error);
=======
      .then(() => {
        // Google sign-in was successful; prepare for phone verification
        setVerificationId(null); // Reset any existing verificationId
      })
      .catch((error) => {
        setErrorMessage(error.message);
>>>>>>> Stashed changes
      });
  };

  const handleSignUp = (event) => {
    event.preventDefault();
<<<<<<< Updated upstream
    // Use createUserWithEmailAndPassword for signing up new users
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Sign-up successful.
        // You can use userCredential.user to access the registered user's information

        console.log("USER CREDENTIAL ID: ", userCredential.user.uid);
        localStorage.setItem("uid", userCredential.user.uid);
        localStorage.setItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying",
          userCredential.user.uid
        );
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
=======
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Email and password sign-up was successful; prepare for phone verification
        setVerificationId(null); // Reset any existing verificationId
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const sendVerificationCode = () => {
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setVerificationId(confirmationResult.verificationId);
      })
      .catch((error) => {
        setErrorMessage("Failed to send verification code: " + error.message);
      });
  };

  const verifyCode = () => {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    auth.currentUser
      .linkWithCredential(credential)
      .then(() => {
        navigate("/onboarding"); // Navigate to onboarding after successful phone verification
      })
      .catch((error) => {
        setErrorMessage("Invalid code entered: " + error.message);
>>>>>>> Stashed changes
      });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>Sign Up</div>
      </header>

      <main className="landing">
<<<<<<< Updated upstream
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
=======
        {!verificationId ? (
          <>
            <form onSubmit={handleSignUp}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            </form>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={sendVerificationCode}>
              Send Verification Code
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={verifyCode}>Verify Code</button>
          </>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
>>>>>>> Stashed changes
      </main>

      <footer className="app-footer">
        <div id="recaptcha-container"></div>
        <div>CS 307 Team 40</div>
      </footer>
    </div>
  );
};

export default SignUp;
