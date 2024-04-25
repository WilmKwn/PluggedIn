import React, { useState, useEffect } from "react";
import axios from "axios";
import MainBanner from "./MainBanner";
import MainBottomBar from "./MainBottomBar";
import Post from "./Post";
import "../App.css";
import "../index.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [sortBy, setSortBy] = useState("Recent");
  const [searchText, setSearchText] = useState(""); // State for search text

  const fetchPosts = async () => {
    try {
      const apiUrl = "http://localhost:5001/post";
      const postsResponse = await axios.get(apiUrl);
      const fetchedPosts = postsResponse.data;

      const loggedInId = localStorage.getItem("actualUserIdBecauseWilliamYongUkKwonIsAnnoying");
      const userResponse = await axios.get(`http://localhost:5001/user/${loggedInId}`);
      const userHashtags = userResponse.data.hashtags || [];

      const newsPosts = await Promise.all(
        fetchedPosts.map(async (post) => {
          const ownerResponse = await axios.get(`http://localhost:5001/user/${post.owner}`);
          const owner = ownerResponse.data;
          console.log(userHashtags);
          console.log(post.tags)
          if (owner.accountType === 2 && (post.tags.some(tag => userHashtags.includes(tag.toLowerCase())))) {
            return post;
          }
          return null;
        })
      );

      let validPosts = newsPosts.filter(post => post !== null);

      // Filter posts by search text if it is not empty
      if (searchText) {
        validPosts = validPosts.filter(post =>
          post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
        );
      }

      validPosts = validPosts.reverse();

      // Store recent posts directly
      setRecentPosts([...validPosts]);

      // Store popular posts sorted by likes
      setPopularPosts([...validPosts].sort((a, b) => {
        const likesA = a.reactions?.likes || 0;
        const likesB = b.reactions?.likes || 0;
        return likesB - likesA;
      }));

    } catch (err) {
      console.error("Can't load posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = fetchPosts;
    return () => ws.close(); // Clean up WebSocket connection
  }, [searchText]); // React to changes in searchText

  useEffect(() => {
    // Switch between recent and popular posts
    setPosts(sortBy === "Recent" ? recentPosts : popularPosts);
  }, [sortBy, recentPosts, popularPosts]);

  const toggleSortBy = () => {
    setSortBy(sortBy === "Recent" ? "Popular" : "Recent");
  };

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="container">
      <MainBanner />
      <div className="search-for-text">Search For</div>
      <div className="search-textbox">
        <input
          type="text"
          placeholder="Enter a hashtag"
          value={searchText}
          onChange={handleSearchInputChange}
        />
      </div>
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
          </div>
        </div>
      </div>
      <MainBottomBar />
    </div>
  );
};

export default Feed;
