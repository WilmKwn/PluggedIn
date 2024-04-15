import React from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";

import Messaging from "./Messaging";

import "../App.css";
import "../index.css";
// Search,

const ProfileBottomBar = ({ currentPlace }) => {
  const navigate = useNavigate();
  const handleSettings = () => {
    navigate("/settings");
  };
  const handleEditProfile = () => {
    navigate("/editprofile");
  };
  return (
    <footer className="app-footer flex justify-between items-center">
      <div className="pl-4">
        <button onClick={handleSettings} className="button">
          Settings <FontAwesomeIcon icon={faGear} />
        </button>
      </div>
      <div>
        <button onClick={handleEditProfile} className="button">
          Edit Profile
          <FontAwesomeIcon icon={faPencil} />
        </button>
      </div>
      <div className="pr-4">
        <Messaging
          title="Messages"
          content="Here you will see your conversations."
        />
      </div>
    </footer>
  );
};
export default ProfileBottomBar;
