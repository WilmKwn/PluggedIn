import React, { useEffect, useState } from "react";
import axios from "axios";

import MainBanner from "./MainBanner";
import "../App.css";
import "../index.css";
import MainBottomBar from "./MainBottomBar";
import Post from "./Post";
import Song from "./Song";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [sortBy, setSortBy] = useState("Recent");
  const [selectedTag, setSelectedTag] = useState(null);
  const tagOptions = [
    "Foryou",
    "Song",
    "Pop",
    "EDM",
    "Cat",
    "R&B",
    "HipHop",
    "Classical",
  ];

  const formatTag = (tag) => {
    // Lowercase the tag and remove non-alphanumeric characters
    return tag.toLowerCase().replace(/[^a-z0-9]/gi, "");
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag); // Toggle selection or deselect
  };

  const fetchPosts = () => {
    let apiUrl = "http://localhost:5001/post";
    axios
      .get(apiUrl)
      .then((res) => {
        let fetchedPosts = res.data;
        if (selectedTag) {
          const formattedTag = formatTag(selectedTag);
          fetchedPosts = fetchedPosts.filter((post) =>
            post.tags.includes(`#${formattedTag}`)
          );
        }
        if (sortBy === "Popular") {
          fetchedPosts.sort(
            (a, b) => (b.reactions.likes || 0) - (a.reactions.likes || 0)
          );
        }
        setPosts(fetchedPosts);
      })
      .catch((err) => {
        console.log("Can't load posts: ", err);
      });

    axios.get("http://localhost:5001/song").then((res) => {
      setTags(res.data);
    });
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedTag, sortBy]);

  const toggleSortBy = () => {
    setSortBy(sortBy === "Recent" ? "Popular" : "Recent");
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
          <label>
            <b>Explore Categories</b>
            <div
              className="scrollable-box"
              style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
            >
              {tagOptions.map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  className={selectedTag === tag ? "selected" : ""}
                  onClick={() => handleTagChange(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </label>
          <div className="posts-container">
            {selectedTag ? (
              posts.length > 0 ? (
                posts.map((post) => <Post key={post._id} postParam={post} />)
              ) : (
                <div>No posts here... yet!</div>
              )
            ) : (
              <div>Select a category to see posts.</div>
            )}
          </div>
        </div>
      </div>
      <MainBottomBar />
    </div>
  );
};

export default Explore;
