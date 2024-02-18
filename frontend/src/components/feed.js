import React, {useEffect, useState} from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from 'axios';
import MainBanner from './MainBanner';
import "../App.css";
import '../index.css';
import MainBottomBar from "./MainBottomBar";

const Feed = () => {
  const [posts, setPosts] = useState([{},{},{},{}]);

  useEffect(() => {
    axios.get('http://localhost:5000/post').then((res) => {
      // get all posts on page load
      const fetchedPosts = res.data;
      setPosts(fetchedPosts);
      
    }).catch((err) => {
      console.log("Cant load posts: ", err);
    })
  }, []);

  const Card = ({post}) => {
    return (
      <div className="w-5/12 h-52 bg-gray-300 border-2 border-black mb-5">
        <p>HI</p>
      </div>
    )
  }

  return (
    <React.Fragment>
      <MainBanner />
      <div className="w-full h-full text-center pt-28">
        <div className="overflow-y-auto w-full h-full flex flex-col items-center pt-5">
          {posts.length===0 && <div>Hello! This is your feed, a place to view humblebrags.</div>}
          {posts.map((post, index) => (
            <Card key={index} post={post}/>
            ))}
        </div>

        <MainBottomBar />
      </div>
    </React.Fragment>
  );
};

export default Feed;
