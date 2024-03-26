import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

import { storage, ref, getDownloadURL } from "./firebase";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import MainBanner from "./MainBanner";
import "../App.css";
import "../index.css";
import MainBottomBar from "./MainBottomBar";
import Post from "./Post";
import Song from "./Song";

const Gallery = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/post")
      .then((res) => {
        const fetchedPosts = res.data;
        const filteredPosts = fetchedPosts.reverse().filter((post) => {
          return post.tags.includes("#song");
        });
        setPosts(filteredPosts);
      })
      .catch((err) => {
        console.log("Cant load posts: ", err);
      });

    axios.get("http://localhost:5001/song").then(res => {
      const d = res.data;
      setTags(d);
    });
  }, []);

  return (
    <div className="container">
      <MainBanner />
      <div className="w-full h-full text-center pt-28">
        <div className="w-full h-full flex flex-col items-center pt-5 pb-20">
          {posts.length === 0 && (
            <div>Hello! This is your feed, a place to view humblebrags.</div>
          )}
          {posts.map((post, index) => (
            <Post key={index} postParam={post} />
          ))}
          {tags.map((tag, index) => (
            <Song key={index} songParam={tag} />
          ))}
        </div>
      </div>
      <MainBottomBar />
    </div>
  );
};

export default Gallery;
