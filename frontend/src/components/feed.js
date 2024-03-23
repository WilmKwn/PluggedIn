import React, { useState, useEffect } from "react";
import { storage, ref, getDownloadURL } from "./firebase";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import MainBanner from "./MainBanner";
import MainBottomBar from "./MainBottomBar";
import Post from "./Post";
import "../App.css";
import "../index.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("recent");

  const fetchPosts = () => {
    axios
      .get("http://localhost:5001/post", {
        params: { sortBy: sortBy } // Pass sortBy parameter to backend
      })
      .then((res) => {
        const fetchedPosts = res.data;
        setPosts(fetchedPosts.reverse()); // Reverse the order of posts here
      })
      .catch((err) => {
        console.log("Can't load posts: ", err);
      });
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      fetchPosts();
    };
    fetchPosts();
  }, [sortBy]); // Trigger fetchPosts when sortBy changes

  const toggleSortBy = () => {
    setSortBy(sortBy === "recent" ? "popular" : "recent");
  };

  return (
    <div className="container">
      <MainBanner />
      {/* Sort By text */}
      <div className="sort-by-text">Sort By:</div>
      {/* Toggle button */}
      <div className="toggle-button-container">
        <button className="toggle-button" onClick={toggleSortBy}>
          {sortBy === "recent" ? "Recent" : "Popular"}
        </button>
      </div>
      <div className="w-full h-full text-center pt-28">
        <div className="w-full h-full flex flex-col items-center pt-5 pb-20">
          {/* Render posts */}
          <div className="posts-container">
            {posts.map((post) => (
              <Post key={post._id} postParam={post} />
            ))}
          </div>
        </div>
      </div>
      <MainBottomBar />
    </div>
  );
};

export default Feed;
