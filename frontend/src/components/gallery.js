import React, { useEffect, useState } from "react";
import axios from "axios";

import MainBanner from "./MainBanner";
import "../App.css";
import "../index.css";
import MainBottomBar from "./MainBottomBar";
import Post from "./Post";
import Song from "./Song";

const Gallery = () => {
  let fetchedPosts = [];
  let sortedPosts = [];

  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [sortBy, setSortBy] = useState("Recent");

  const fetchPosts = () => {
    let apiUrl = "http://localhost:5001/post";

    axios
      .get(apiUrl)
      .then((res) => {
        fetchedPosts = res.data;
        fetchedPosts = fetchedPosts.reverse().filter((post) => {
          return post.tags.includes("#song") || post.tags.includes("#producertag");
        });

        sortedPosts = [...fetchedPosts].sort((a, b) => {
          const likesA = a.reactions.likes || 0;
          const likesB = b.reactions.likes || 0;
          return likesB - likesA;
        });

        let finalPosts;

        if (sortBy === "Recent") {
          finalPosts = fetchedPosts;
        } else {
          finalPosts = sortedPosts;
        }

        setPosts(finalPosts);
      })
      .catch((err) => {
        console.log("Can't load posts: ", err);
      });

    axios.get("http://localhost:5001/song").then(res => {
        const d = res.data;
        setTags(d);
      });
  }

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      fetchPosts();
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  const toggleSortBy = () => {
    const newSortBy = sortBy === "Recent" ? "Popular" : "Recent";
    setSortBy(newSortBy);
  };

  return (
    <div className="container">
      <MainBanner />
      <div className="sort-by-text">Sort By</div>
      <div className="toggle-button-container">
        <button className="toggle-button" onClick={toggleSortBy}>
          {sortBy}
        </button>
      </div>
      <div className="w-full h-full text-center pt-28">
        <div className="w-full h-full flex flex-col items-center pt-5 pb-20">
          <div className="posts-container">
            {posts.map((post) => (
              <Post key={post._id} postParam={post} />
            ))}
            {/* {tags.map((tag, index) => (
              <Song key={index} songParam={tag} />
            ))} */}
          </div>
        </div>
      </div>
      <MainBottomBar />
    </div>
  );
};

export default Gallery;
