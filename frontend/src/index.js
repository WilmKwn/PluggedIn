import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./components/App";
import Feed from "./components/feed";
import Onboarding from "./components/onboarding";

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
