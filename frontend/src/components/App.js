import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../App.css";
library.add(faSearch);

const App = () => {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const userId = auth.currentUser.uid;
        localStorage.setItem("userId", userId);

        axios.get(`http://localhost:5001/user/${userId}`).then((res) => {
          navigate("/feed");
        }).catch((err) => {
          navigate("/onboarding");
        });
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
