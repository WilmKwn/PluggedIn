import React, { useState, useEffect } from "react";
import axios from "axios";
import MainBanner from "./MainBanner";
import MainBottomBar from "./MainBottomBar";
import Post from "./Post";
import "../App.css";
import "../index.css";
import "../SortingSearching.css";

import useSpeechToText from "./hooks/useSpeechToText";

const Feed = () => {
  let fetchedPosts = [];
  let sortedPosts = [];

  const [connections, setConnections] = useState([]);
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("Recent");
  const [searchText, setSearchText] = useState(""); // Define searchText state

  const {text, start, stop, listening} = useSpeechToText();
  
  const fetchPosts = () => {
    let apiUrl = "http://localhost:5001/post";

    axios
      .get(apiUrl)
      .then((res) => {
        fetchedPosts = res.data;
        fetchedPosts.reverse();
        
        fetchedPosts = fetchedPosts.filter((post) =>
          connections.includes(post.owner) || post.owner == localStorage.getItem("userId")
        );
        
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
        
        if (searchText) {
          finalPosts = finalPosts.filter(post =>
            post.tags.some(tag => tag.includes(searchText))
          );
        }

        setPosts(finalPosts);
      })
      .catch((err) => {
        console.log("Can't load posts: ", err);
      });
  };

  const fetchConnections = () => {
    axios
    .get(`http://localhost:5001/user/${localStorage.getItem("userId")}`)
    .then((res) => {
      console.log("got data" + res.data);
      const d = res.data;
        setConnections(d.friends);
      });
    };
    
  useEffect(() => {
    fetchPosts();
  }, [connections]);
    
  useEffect(() => {
    fetchConnections();

    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      fetchPosts();
    };
  }, []);
  
  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [searchText]);
  
  const toggleSortBy = () => {
    const newSortBy = sortBy === "Recent" ? "Popular" : "Recent";
    setSortBy(newSortBy);
  };
  
  // Define handleSearchInputChange function
  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleVoiceButton = () => {
    if (listening) {
      stop();
    } else {
      start();
    }
  }

  return (
    <div className="container">
      <MainBanner />
      <button onClick={()=>handleVoiceButton()} className={`voice-assist ${listening ? 'bg-red-300' : 'bg-gray-300'} p-2`}>Voice Assist</button>

      <div className="sort-by-text">Sort By</div>
      <div className="toggle-button-container">
        <button className="toggle-button" onClick={() => toggleSortBy()}>
          {sortBy}
        </button>
      </div>
      <div className="search-for-text">Search For</div>
      <div className="search-textbox">
        <input
          type="text"
          placeholder="Enter a hashtag"
          value={searchText}
          onChange={(e) => handleSearchInputChange(e)}
        />
      </div>
      <div className="w-full h-full text-center pt-28">
        <div className="w-full h-full flex flex-col items-center pt-5 pb-20">
          {/* Render posts */}
          <div className="posts-container">
            {posts.map((post) => (
              <Post key={post._id} postParam={post} input={text}/>
            ))}
          </div>
        </div>
      </div>
      <MainBottomBar />
    </div>
  );
};

export default Feed;
