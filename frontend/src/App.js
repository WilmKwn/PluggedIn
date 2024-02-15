import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./components/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./App.css";

const App = () => {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/feed");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>PluggedIn</div>
        <nav>
          <button onClick={signInWithGoogle}>Sign In</button>
        </nav>
      </header>

      <main className="landing">
        <div>Welcome to PluggedIn</div>
        <div>Connect. Collab. Become a Rockstar!</div>
      </main>
      <footer className="app-footer">
        <div>CS 307 Team 40</div>
      </footer>
    </div>
  );
};

export default App;
