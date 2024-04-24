import React, { useEffect } from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

import "../App.css";
import "../index.css";
import "../BottomBanner.css";
// Settings, Add Post, Other User Profiles
const SecondaryBanner = () => {
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
  const handleBack = () => {
    window.history.back();
  };

  const handleProfile = () => {
    navigate("/profile");
  };
  const handleFeed = () => {
    navigate("/feed");
  };

  return (
    <div className="">
      <div className="fixed-banner secondary-banner">
        <div className="w-full flex justify-between items-center p-3 pl-10 pr-10">
          <div>
            <button onClick={handleBack} className="button">
              <FontAwesomeIcon icon={faArrowLeftLong} /> <div>&nbsp;</div>Back
            </button>
          </div>

          <div className="flex items-center pl-14">
            <a onClick={handleFeed}>
              <img src="/PI.png" alt="PluggedIn Logo" className="logo"></img>
            </a>
          </div>

          <nav>
            <button onClick={handleProfile} className="button">
              Your Profile <div>&nbsp;</div>
              <FontAwesomeIcon icon={faUser} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SecondaryBanner;
