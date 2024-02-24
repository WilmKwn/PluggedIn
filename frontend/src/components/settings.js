import React, {useEffect, useState} from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from 'axios';
import SecondaryBanner from './SecondaryBanner';
import "../App.css";
import '../index.css';
import SecondaryBottomBar from "./SecondaryBottomBar";


const Settings = () => {
    return (
        <div>
            <SecondaryBanner />
            <SecondaryBottomBar />
        </div>
    );
};
export default Settings;