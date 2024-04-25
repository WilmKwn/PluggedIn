import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

import Notification from "./Notification";

import ringingBell from "../ringing.gif";
import "../Banner.css"; // Assuming the CSS file is in the same directory

import "../App.css";
import "../index.css";
// Feed, News, Gallery, Search
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
  };
  const handleGallery = () => {
    navigate("/gallery");
  };
  const handleProfile = () => {
    const userId = localStorage.getItem("userId");
    navigate("/profile", { state: { userId } });
  };
  const handleFeed = () => {
    navigate("/feed");
  };
  const handleNews = () => {
    navigate("/news");
  };

  const [openNoti, setOpenNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const getNotifications = () => {
    axios
      .get(`http://localhost:5001/user/${localStorage.getItem("userId")}`)
      .then((res) => {
        const data = res.data;
        setNotifications(data.notifications.reverse());
      })
      .catch((err) => {
        console.log("error is ", err);
      });
  };

  const [openPopup, setOpenPopup] = useState(false);
  const showPopup = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        <div className="bg-gray-400 w-1/2 h-1/2 flex items-center justify-center ">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">{openPopup}</h2>
            <button
              onClick={() => setOpenPopup(false)}
              className="mt-4 bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // useEffect(() => {
  //   toast.info(notifications[0]);
  // }, [notifications]);

  const [isNewNotis, setIsNewNotis] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8282");
    ws.onmessage = (event) => {
      getNotifications();
      setIsNewNotis(true);
    };
    getNotifications();
  }, []);

  return (
    <div className="fixed-banner">
      <div className="button" onClick={handleSearch}>
        Search <div>&nbsp;</div>
        <FontAwesomeIcon icon={faSearch} />
      </div>

      <div className="button" onClick={handleGallery}>
        Gallery <div>&nbsp;</div>
        <FontAwesomeIcon icon={faList} />
      </div>

      <div className="flex items-center pl-7">
        <a onClick={handleFeed}>
          <img src="/PI.png" alt="PluggedIn Logo" className="logo" />
        </a>
      </div>

      <div className="button" onClick={handleNews}>
        News <div>&nbsp;</div>
        <FontAwesomeIcon icon={faNewspaper} />
      </div>

      {isNewNotis ? (
        <img
          onClick={() => {
            setOpenNoti(!openNoti);
            setIsNewNotis(false);
          }}
          src={ringingBell}
          alt=""
          className="noti-button w-10"
        />
      ) : (
        <button onClick={() => setOpenNoti(!openNoti)} className="noti-button">
          🔔
        </button>
      )}

      {openNoti && (
        <div className="noti-panel">
          {notifications.map((noti, index) => (
            <Notification key={index} message={noti} func={setOpenPopup} />
          ))}
        </div>
      )}

      <div className="button" onClick={handleProfile}>
        Your Profile <div>&nbsp;</div>
        <FontAwesomeIcon icon={faUser} />
      </div>
    </div>
  );
};

export default MainBanner;
