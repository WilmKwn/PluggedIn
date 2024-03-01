import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { storage, ref, getDownloadURL } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MainBanner from "./MainBottomBar";
import MainBottomBar from "./MainBottomBar";
import ProfileBottomBar from "./ProfileBottomBar";
import ProfileBanner from "./ProfileBanner";
import Post from "./Post";
import MicroPost from "./MicroPost";

import { useState, useEffect } from "react";

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
  const [userPosts, setUserPosts] = useState([]);
  const userId = localStorage.getItem("userId");
  const [userSkills, setUserSkills] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5001/user/${userId}`)
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
  useEffect(() => {
    axios.get(`http://localhost:5001/post/owner/${userId}`)
    .then((res) => {
      console.log("got posts");
      console.log(res.data);
      setUserPosts(res.data)
    })
    .catch((error) => {
      console.error("Error getting posts:", error);
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
      <div className="w-1/3 overflow-y-hidden">
<div className="h-full text-center pt-28 border-2 border-solid border-#283e4a bg-gradient-to-br from-emerald-950 to-gray-500 rounded-md shadow-lg overflow-hidden">        
        {/* <div>Activity</div>
        <div className="overflow-y-auto w-full h-full flex flex-col items-center pt-5">
          <div className="w-5/12 h-52 bg-gray-300 border-2 border-black mb-5">
            <p>HI</p>
          </div>
        </div> */}
        {userPosts.map((post, index) => (
            // <Card key={index} post={post} />
            <MicroPost key={index} postParam={post} />
          ))}
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
    if (!userData.skills || userData.skills.length === 0) {
      userData.skills = [];
    }
    else {
      setUserSkills(userData.skills);
      console.log(userData.skills)
    }

    if (userData.description === null) {
      userData.description = "No Description";
    }

    if (!userData.projects || userData.projects.length === 0) {
      userData.projects = "No Projects";
    }

    // GET IMAGE FROM FIREBASE STORAGE
    const [image, setImage] = useState("");
    useEffect(() => {
      const picRef = ref(storage, "user/" + userData.profilePic);
      getDownloadURL(picRef)
        .then((url) => {
          setImage(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
    console.log(userData.skills)
    return (
      <div className="h-full pt-28 flex flex-col items-center">
        {userData.profilePic === "No file chosen" ? (
          <div className="w-40 h-40 bg-gray-300"></div>
        ) : (
          <img className="w-40" src={image} />
        )}
        <div>{userData.name}</div>
        <div>{userData.genre}</div>
        <div>{userData.description}</div>
        <div>{userData.projects}</div>

        <div className="edit-profile-container">
          <div className="skills-profile">
            <h2>Skills</h2>
            <ul>
              {userData.skills.length > 0 ? userSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              )) : "No skills"}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Banner />
      <div className="w-full h-full flex justify-around items-center">
        <Gallery />
        <ProfileInfo />
        <Activity />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
