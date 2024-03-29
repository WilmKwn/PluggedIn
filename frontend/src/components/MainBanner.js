import React, {useEffect, useState} from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

import Notification from "./Notification";

import { toast } from 'react-toastify';

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
  }
  const handleGallery = () => {
    navigate("/gallery");
  }
  const handleProfile = () => {
    const userId = localStorage.getItem("userId");
    navigate("/profile", { state: { userId } });
  }
  const handleFeed = () => {
    navigate("/feed");
  }
  const handleNews = () => {
    navigate("/news");
  }

  const [openNoti, setOpenNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const getNotifications = () => {
    axios.get(`http://localhost:5001/user/${localStorage.getItem("userId")}`).then((res) => {
      const data = res.data;
      setNotifications(data.notifications.reverse());
    }).catch(err => {
      console.log(err);
    });
  }

  // useEffect(() => {
  //   toast.info(notifications[0]);
  // }, [notifications]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8282');
    ws.onmessage = (event) => {
      getNotifications();
    };
    getNotifications();
  }, []);

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
        <div className="flex items-center pl-7">
            <a onClick={handleFeed}>
            <img src="/PI.png"
            alt="PluggedIn Logo"
            className="w-20 cursor-pointer "
            ></img>
            </a>
        </div>
        <nav>
          <button onClick={handleNews}
            className="button">
                News <FontAwesomeIcon icon={faNewspaper} /></button>
        </nav>
        <button onClick={() => setOpenNoti(!openNoti)} className="absolute text-2xl bg-gray-500 p-1 right-12 top-32 hover:bg-gray-400">🔔</button>
        {openNoti && (
          <div className="absolute w-1/4 h-80 bg-gray-300 p-1 right-12 top-44 px-2 py-2 overflow-y-scroll border-2 border-black">
            {notifications.map((noti, index) => (
              <Notification key={index} message={noti} />
            ))}
          </div>
        )}
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
