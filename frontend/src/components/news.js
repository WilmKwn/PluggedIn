import React, {useEffect, useState} from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from 'axios';
import MainBanner from './MainBanner';
import "../App.css";
import '../index.css';
import MainBottomBar from "./MainBottomBar";


const News = () => {
    return (
        <div>
            <MainBanner />
            <MainBottomBar />
        </div>
    );
};
export default News;