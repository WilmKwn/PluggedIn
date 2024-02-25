import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { updateProfile, signOut } from "firebase/auth";
import axios from "axios";

const Onboarding = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (auth.currentUser) {
      try {
        const data = {
          uid: auth.currentUser.uid,
          username: displayName,
          accountType: 1,
          profilePic: profilePic,
          genre: "...",
          description: description,
          projects: [],
          skills: [],
          tracks: [],
          friends: [],
          endorsed: [],
          outgoingRequests: [],
          recentActivity: [],
        };
        axios.post("http://localhost:5001/user", data).then(() => {
          console.log("successfully onboarded");
          navigate("/feed");
        });
        navigate("/feed");
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>PluggedIn</div>
        <nav>
          <button onClick={handleSignOut}>Sign Out</button>
        </nav>
      </header>
      <div className="landing">
        <h2>Welcome! Let's set up your profile.</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Display Name:
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </label>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Profile Picture:
            <input
              type="file"
              onChange={handleProfilePicChange}
              accept="image/*"
            />
          </label>
          <button type="submit">Finish Setup</button>
        </form>
      </div>
      <footer className="app-footer">
        <div>CS 307 Team 40</div>
      </footer>
    </div>
  );
};

export default Onboarding;
