import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MainBanner from "./MainBottomBar";
import MainBottomBar from "./MainBottomBar";
import ProfileBottomBar from "./ProfileBottomBar";
import ProfileBanner from "./ProfileBanner";

import { useState, useEffect } from 'react';

const Banner = () => {
  const navigate = useNavigate();

  const handleFeed = () => {
    navigate("/feed");
  };
  return <ProfileBanner />;
};

const Footer = () => {
  return <ProfileBottomBar />;
};



const Profile = () => {
  const [userData, setUserData] = useState({
    profilePic: "",
    name: "",
    genre: "",
    description: "",
    skills: [],
    projects: [],
  });
  const userId = auth.currentUser.uid;

  useEffect(() => {
    axios.get(`http://localhost:5001/user/${userId}`)
        .then((res) => {
            // Process the user data here if the response was successful (status 200)
            console.log("got user data");
            setUserData(res.data); // Update state with user data
        })
        .catch((error) => {
            console.error("Error:", error);
            // Handle any errors that occur during the fetch request
        });
  }, []); 


  const Gallery = () => {
    return (
      <div className="w-1/3 h-full text-center pt-28 border-2 border-black">
        <div>Gallery</div>
        <div className="overflow-y-auto w-full h-full flex flex-col items-center pt-5">
          <div className="w-5/12 h-52 bg-gray-300 border-2 border-black mb-5">
            <p>HI</p>
          </div>
        </div>
      </div>
    );
  };
  
  const Activity = () => {
    return (
      <div className="w-1/3 h-full text-center pt-28 border-2 border-black">
        <div>Activity</div>
        <div className="overflow-y-auto w-full h-full flex flex-col items-center pt-5">
          <div className="w-5/12 h-52 bg-gray-300 border-2 border-black mb-5">
            <p>HI</p>
          </div>
        </div>
      </div>
    );
  };
  
  const ProfileInfo = () => {  
      // // check for profile pic
      if (!userData.profilePic || userData.profilePic === null) {
          userData.profilePic = "No Profile Picture";
      }
  
      // check for null skills and description and projects
      if (!userData.skills ||userData.skills.length === 0) {
          userData.skills = "No Skills";
      }
  
      if (userData.description === null) {
          userData.description = "No Description";
      }
  
      if (!userData.projects || userData.projects.length === 0) {
          userData.projects = "No Projects";
      }
  
      return (
          <div className="w-1/3 h-full text-center pt-28">
              <div>{userData.profilePic}</div>
              <div>{userData.name}</div>
              <div>{userData.genre}</div>
              <div>{userData.description}</div>
              <div>{userData.skills}</div>
              <div>{userData.projects}</div>
          </div>
      )
      // return <p></p>
  }

  return (
    <div>
      <Banner />
      <div className="w-full h-full flex justify-between items-center">
        <Gallery />
        <ProfileInfo />
        <Activity />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
