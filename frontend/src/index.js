import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./components/App";
import Feed from "./components/feed";
import Onboarding from "./components/onboarding";
import Profile from "./components/Profile";
import Gallery from "./components/gallery";
import News from "./components/news";
import Search from "./components/search";
import Settings from "./components/settings";
import AddPost from "./components/AddPost";
import Post from "./components/Post";
import EditProfile from "./components/EditProfile";

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/addpost" element={<AddPost />} />
        <Route path="/post" element={<Post />} />
        <Route path="/editprofile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
