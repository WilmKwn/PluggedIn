import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import MainBanner from './MainBottomBar';
import MainBottomBar from "./MainBottomBar";


const Banner = () => {
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

    const handleFeed = () => {
        navigate("/feed");
    }
    return (
        <div className="">
            <div className="fixed w-full flex justify-between items-center p-3 pl-10 pr-10 bg-emerald-950">
                <div>
                    <button onClick={handleFeed}
                        className="button">
                        Back
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
                <div>
                    <nav>
                        <button onClick={handleSignOut}
                            className="button">
                            Sign Out
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}

const Footer = () => {
    return (
        <footer className="app-footer flex justify-between items-center">
            <div className="pl-4">
                <button
                    className="button">
                    Settings
                </button>
            </div>
            <div>
                <button
                    className="button">
                    Edit Profile
                </button>
            </div>
            <div className="pr-4">
                <button
                    className="button">
                    Messages
                </button>
            </div>
        </footer>
    )
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
    return (
        <div className="w-1/3 h-full text-center pt-28">
            <div>Profile Pic</div>
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