import React from "react";
import { useNavigate } from "react-router-dom";
// You might need additional imports depending on the rest of your app's functionalities
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../App.css"; // Ensure the path matches your project structure
import "../Banner.css";

library.add(faSearch);

const App = () => {
  const navigate = useNavigate();

  // Function to navigate to the sign-in page
  const redirectToSignInPage = () => {
    navigate("/signin");
  };

  const redirectToSignUpPage = () => {
    navigate("/signup");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>PluggedIn</div>
        <nav>
          <button onClick={redirectToSignInPage}>Sign In</button>
          <button onClick={redirectToSignUpPage}>Sign Up</button>
        </nav>
      </header>

      <main className="landing">
        <div>Welcome to PluggedIn</div>
        <div>Connect. Collab. Become a Rockstar!</div>
      </main>

      <footer className="app-footer">
        <div>CS 307 Team 40</div>
      </footer>
    </div>
  );
};

export default App;
