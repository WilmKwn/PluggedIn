import React, {useEffect} from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faSearch, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

import "../App.css";
import "../index.css";
// Settings, Add Post, Other User Profiles
const ProfileBanner = ({id}) => {
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
  }

  const handleProfile = () => {
    navigate("/profile");
  }
  const handleFeed = () => {
    navigate("/feed");
  }
  
  return (
      <div className="fixed-banner w-full flex justify-between items-center p-3 pl-10 pr-10 ">
        <div>
          <button onClick={handleBack}
            className="button">
                <FontAwesomeIcon icon={faArrowLeftLong} /> Back
          </button>
        </div>

        
        <div className="flex items-center pl-14">
            <a onClick={handleFeed}>
            <img src="/PI.png"
            alt="PluggedIn Logo"
            className="w-20 cursor-pointer"
            ></img>
            </a>
        </div>

        {console.log(id)}
        
        <nav>
          <button onClick={handleSignOut}
            className={`button ${id.id !== localStorage.getItem("userId") && 'hidden'}`}>
                Sign Out <FontAwesomeIcon icon={faUserSlash} /></button>
        </nav>
      </div>
  );
};

export default ProfileBanner;
