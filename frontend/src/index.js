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
      </Routes>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
