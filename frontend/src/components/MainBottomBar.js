import React, { useEffect } from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';

import "../App.css";
import "../index.css";
//Feed, News, Gallery

const MainBottomBar = () => {
    const navigate = useNavigate();

    const handleSettings = () => {
        navigate("/settings");
    }

    const handleAddPost = () => {
        navigate("/addpost");
    }
    return (

        <footer className="app-footer flex justify-between items-center">
            <div className="pl-4">
                <button onClick={handleSettings}
                    className="button">
                    Settings <FontAwesomeIcon icon={faGear} />
                </button>
            </div>
            <div>
                <button onClick={handleAddPost}
                    className="button">
                    Add Post <FontAwesomeIcon icon={faAdd} />
                </button>
            </div>
            <div className="pr-4">
                <button
                    className="button">
                    Messages <FontAwesomeIcon icon={faMessage} />
                </button>
            </div>
        </footer>
    );
};
export default MainBottomBar;