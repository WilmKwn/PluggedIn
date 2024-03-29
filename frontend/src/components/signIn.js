// SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import axios from "axios";
import "../App.css"; // Make sure the path to your CSS file is correct

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidCredentialError, setInvalidCredentialError] = useState(false);
  const [nonexistentAccountError, setNonexistentAccountError] = useState(false);

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
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
        navigate("/feed");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    // Handle sign-in with username and password here
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Sign-in successful.
        // userCredential.user will have user details
        localStorage.setItem("uid", userCredential.user.uid);
        localStorage.setItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying",
          userCredential.user.uid
        );
        navigate("/feed"); // Redirect user after sign-in
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

  return (
    <div className="app">
      <header className="app-header">
        <div>Sign In</div>
      </header>

      <main className="landing">
        <form onSubmit={handleSignIn}>
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
          <button type="submit">Sign In</button>
          <button type="button" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
          {invalidCredentialError && (
            <div className="error-message">
              Valid email address, but sign in with Google.
            </div>
          )}
          {nonexistentAccountError && (
            <div className="error-message">Not a registered account.</div>
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
