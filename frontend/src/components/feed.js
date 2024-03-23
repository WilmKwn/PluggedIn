import React, { useState, useEffect } from "react";
import axios from "axios";
import MainBanner from "./MainBanner";
import MainBottomBar from "./MainBottomBar";
import Post from "./Post";
import "../App.css";
import "../index.css";

const Feed = () => {

  let fetchedPosts = [];
  let sortedPosts = [];

  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("Recent");

  const fetchPosts = () => {
    let apiUrl = "http://localhost:5001/post";

    axios
      .get(apiUrl)
      .then((res) => {
        fetchedPosts = res.data;
        fetchedPosts.reverse()

        sortedPosts = [...fetchedPosts].sort((a, b) => {
          const likesA = a.reactions.likes || 0; // Access the likes value from reactions, default to 0 if it doesn't exist
          const likesB = b.reactions.likes || 0;
          return likesB - likesA; // Sort in descending order based on the number of likes
        });

        if (sortBy === "Recent") {
          setPosts(fetchedPosts);
        } else {
          setPosts(sortedPosts);
        }

        // setPosts(fetchedPosts); // No need to reverse when sorting by popularity
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
    const newSortBy = sortBy === "Recent" ? "Popular" : "Recent";
  setSortBy(newSortBy);
  };
  

  return (
    <div className="container">
      <MainBanner />
      {/* Sort By text */}
      <div className="sort-by-text">Sort By Button</div>
      {/* Toggle button */}
      <div className="toggle-button-container">
        <button className="toggle-button" onClick={toggleSortBy}>
          {sortBy}
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
