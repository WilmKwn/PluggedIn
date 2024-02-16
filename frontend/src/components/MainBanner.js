import React, {useEffect} from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

import "../App.css";
import "../index.css";

const MainBanner = () => {
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
  const handleSearch = () => {
    navigate("/search");
  }
  const handleGallery = () => {
    navigate("/gallery");
  }
  const handleProfile = () => {
    navigate("/profile");
  }
  const handleFeed = () => {
    navigate("/feed");
  }
  const handleNews = () => {
    navigate("/news");
  }
  return (
    <div className="">
      <div className="fixed w-full flex justify-between items-center p-3 pl-10 pr-10 bg-emerald-950">
        <div>
          <button onClick={handleSearch}
            className="button">
                Search <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <div>
          <button onClick={handleGallery}
            className="button">
               Gallery <FontAwesomeIcon icon={faList} />
          </button>
        </div>
        <div>
            <a onClick={handleFeed}>
            <img src="/PI.png"
            alt="PluggedIn Logo"
            className="w-20 cursor-pointer"
            ></img>
            </a>
        </div>
        <nav>
          <button onClick={handleNews}
            className="button">
                News <FontAwesomeIcon icon={faNewspaper} /></button>
        </nav>
        <nav>
          <button onClick={handleProfile}
            className="button">
                Your Profile <FontAwesomeIcon icon={faUser} /></button>
        </nav>
      </div>
    </div>
  );
};

export default MainBanner;
