import React from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./components/firebase";

import "./App.css";

const Feed = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>PluggedIn</div>
        <input type="text" placeholder="Search" className="search-bar" />
        <nav>
          <button onClick={handleSignOut}>Sign Out</button>
        </nav>
      </header>

      <div className="landing">
        <div>Hello! This is your feed, a place to view humblebrags.</div>
      </div>

      <footer className="app-footer">
        <div>CS 307 Team 40</div>
      </footer>
    </div>
  );
};

export default Feed;
