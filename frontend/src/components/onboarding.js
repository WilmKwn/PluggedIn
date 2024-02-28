import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage, ref, uploadBytes } from "./firebase";
import { signOut } from "firebase/auth";
import axios from "axios";

const Onboarding = () => {
    const navigate = useNavigate();
    const [realname, setRealName] = useState("");
    const [username, setUsername] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [fileLabel, setFileLabel] = useState("No file chosen");

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

        if (profilePic) {
            const picRef = ref(storage, "user/"+fileLabel);
            uploadBytes(picRef, profilePic).then(() => {
                console.log("Successfully uploaded image");
            }).catch((err) => {
                console.log(err.message);
            })
        }

        if (auth.currentUser) {
            try {
                const data = {
                    uid: auth.currentUser.uid,
                    realname: realname,
                    username: username,
                    accountType: 0,
                    profilePic: fileLabel,
                    genre: genre,
                    description: description,
                    projects: [],
                    skills: [],
                    tracks: [],
                    friends: [],
                    endorsed: [],
                    outgoingRequests: [],
                    recentActivity: [],
                };
                axios.post('http://localhost:5001/user', data).then(() => {
                    console.log('successfully onboarded');
                    navigate("/feed");
                });
            } catch (error) {
                console.error("Error updating profile: ", error);
            }
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setFileLabel(file.name);
        } else {
            setProfilePic(null);
            setFileLabel("No file chosen");
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
