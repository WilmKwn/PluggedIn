import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import MainBanner from './MainBottomBar';
import MainBottomBar from "./MainBottomBar";
import ProfileBottomBar from "./ProfileBottomBar";
import ProfileBanner from "./ProfileBanner";

const axios = require('axios');


const Banner = () => {
    const navigate = useNavigate();

    
    const handleFeed = () => {
        navigate("/feed");
    }
    // return (
    //     <div className="">
    //         <div className="fixed w-full flex justify-between items-center p-3 pl-10 pr-10 bg-emerald-950">
    //             <div>
    //                 <button onClick={handleFeed}
    //                     className="button">
    //                     <FontAwesomeIcon icon={faArrowLeftLong} /> Back
    //                 </button>
    //             </div>
    //             <div>
    //                 <a onClick={handleFeed}>
    //                     <img src="/PI.png"
    //                         alt="PluggedIn Logo"
    //                         className="w-20 cursor-pointer"
    //                     ></img>
    //                 </a>
    //             </div>
    //             <div>
    //                 <nav>
    //                     <button onClick={handleSignOut}
    //                         className="button">
    //                         Sign Out
    //                     </button>
    //                 </nav>
    //             </div>
    //         </div>
    //     </div>
    // )
    return (
        <ProfileBanner />
    );
}

const Footer = () => {
    
    return (
        <ProfileBottomBar />
    );
}

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
    )
}

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
    )
}

const ProfileInfo = () => {
    const userId = auth.currentUser.uid;

    fetch(`http://localhost:5000/user/${userId}/info`)
    .then((res) => {
        if (res.status === 200) {
            return res.json(); // Parse JSON response
        } else if (res.status === 500) {
            console.log("Server error: Failed to get user info");
            // Handle the case when the server returns a 500 status code
            // You can display an error message to the user or handle it as needed
        } else {
            console.log("Failed to get info");
            // Handle other status codes if necessary
        }
    })
    .then((userData) => {
        // Process the user data here if the response was successful (status 200)
        console.log("got user data");
    })
    .catch((error) => {
        console.error("Error:", error);
        // Handle any errors that occur during the fetch request
    });
    



    return (
        <div className="w-1/3 h-full text-center pt-28">
            <div>userData.uid</div>
            <div>Name</div>
            <div>Genre</div>
            <div>Description</div>
            <div>Projects</div>
        </div>
    )
}

const Profile = () => {
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
    )
}

export default Profile;