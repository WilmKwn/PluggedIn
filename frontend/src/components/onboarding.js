import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage, ref, uploadBytes } from "./firebase";
import { signOut } from "firebase/auth";
import axios from "axios";
import Switch from "react-ios-switch";
import "../App.css";
import "../index.css";

const Onboarding = () => {
  const navigate = useNavigate();
  const [realname, setRealName] = useState("");
  const [username, setUsername] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [fileLabel, setFileLabel] = useState("No file chosen");
  const [isRecordLabelAccount, setIsRecordLabelAccount] = useState(false);
  const [isNewsAccount, setIsNewsAccount] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [newsTags, setNewsTags] = useState([
    { name: "Pop", selected: false },
    { name: "Rock", selected: false },
    { name: "Hip-hop/Rap", selected: false },
    { name: "Electronic/Dance", selected: false },
    { name: "R&B/Soul", selected: false },
    { name: "Country", selected: false },
    { name: "Jazz", selected: false },
    { name: "Classical", selected: false },
    { name: "Reggae", selected: false },
    { name: "Indie/Alternative", selected: false },
  ]);

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

    // Filter out the selected tags
    const selectedTags = newsTags
      .filter((tag) => tag.selected)
      .map((tag) => `#${tag.name.toLowerCase()}`);

    if (profilePic) {
      const picRef = ref(storage, "user/" + fileLabel);
      uploadBytes(picRef, profilePic)
        .then(() => {
          console.log("Successfully uploaded image");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    console.log("Setting account type");

    console.log(isRecordLabelAccount);

    if (auth.currentUser) {
      if (isRecordLabelAccount === true) {
        try {
          const data = {
            uid: auth.currentUser.uid,
            realname: realname,
            username: username,
            accountType: 1,
            profilePic: fileLabel,
            genre: genre,
            description: description,
            recordLabelAccount: isRecordLabelAccount,
            hashtags: selectedTags,
          };

          // console.log("data is " + data)

          axios.post("http://localhost:5001/user", data).then(() => {
            console.log("successfully onboarded");
            localStorage.setItem("userId", auth.currentUser.uid);
            localStorage.setItem(
              "actualUserIdBecauseWilliamYongUkKwonIsAnnoying",
              auth.currentUser.uid
            );
            navigate("/feed");
          });
        } catch (error) {
          console.error("Error updating profile: ", error);
        }
      } else if (isNewsAccount === true) {
        try {
          const data = {
            uid: auth.currentUser.uid,
            realname: realname,
            username: username,
            accountType: 2,
            profilePic: fileLabel,
            genre: genre,
            description: description,
            recordLabelAccount: isRecordLabelAccount,
            hashtags: selectedTags,
          };

          axios.post("http://localhost:5001/user", data).then(() => {
            console.log("successfully onboarded");
            localStorage.setItem("userId", auth.currentUser.uid);
            localStorage.setItem(
              "actualUserIdBecauseWilliamYongUkKwonIsAnnoying",
              auth.currentUser.uid
            );
            navigate("/feed");
          });
        } catch (error) {
          console.error("Error updating profile: ", error);
        }
      } else {
        try {
          const data = {
            uid: auth.currentUser.uid,
            realname: realname,
            username: username,
            accountType: 2,
            profilePic: fileLabel,
            genre: genre,
            description: description,
            hashtags: selectedTags,
          };

          axios.post("http://localhost:5001/user", data).then(() => {
            console.log("successfully onboarded");
            localStorage.setItem("userId", auth.currentUser.uid);
            localStorage.setItem(
              "actualUserIdBecauseWilliamYongUkKwonIsAnnoying",
              auth.currentUser.uid
            );
            navigate("/feed");
          });
        } catch (error) {
          console.error("Error updating profile: ", error);
        }
      }
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setFileLabel(file.name);
    } else {
      setProfilePic("No file chosen.png");
      setFileLabel("No file chosen");
    }
  };

  const handleRecordLabelSwitchChange = (newState) => {
    if (newState) {
      setIsNewsAccount(false);
    }
    setIsRecordLabelAccount(newState);
    setShowWarning(newState);
  };

  const handleNewsSwitchChange = (newState) => {
    if (newState) {
      setIsRecordLabelAccount(false);
    }
    setIsNewsAccount(newState);
    setShowWarning(newState);
  };

  const handleTagChange = (index) => {
    const newTags = [...newsTags];
    newTags[index].selected = !newTags[index].selected;
    setNewsTags(newTags);
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
            <b>Real Name (First and Last):</b>
            <input
              type="text"
              value={realname}
              onChange={(e) => setRealName(e.target.value)}
              required
            />
          </label>
          <label>
            <b>Username:</b>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            <b>Genre:</b>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </label>
          <label>
            <b>Description:</b>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            <b>Which of These Categories Interest You?</b>
            <div
              className="scrollable-box"
              style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
            >
              {newsTags.map((tag, index) => (
                <button
                  key={index}
                  type="button" // Specify button type as button to prevent form submission
                  className={tag.selected ? "selected" : ""}
                  onClick={() => handleTagChange(index)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </label>

          <label>
            <b>Profile Picture:</b>
            <div className="file-input-container">
              <input
                type="file"
                onChange={handleProfilePicChange}
                accept="image/*"
              />
              <span>{fileLabel}</span>
            </div>
          </label>
          <div className="flex items-center justify-center mb-3">
            <span className="mr-2">Record Label Account</span>
            <Switch
              checked={isRecordLabelAccount}
              onChange={handleRecordLabelSwitchChange}
              onColor="#007AFF"
              offColor="#E5E5EA"
            />
            <span className="mr-2">News Account</span>
            <Switch
              checked={isNewsAccount}
              onChange={handleNewsSwitchChange}
              onColor="#007AFF"
              offColor="#E5E5EA"
            />
          </div>
          {showWarning && (
            <p className="warning-text">
              Cannot revert back to a normal account
            </p>
          )}
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
