import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import SecondaryBanner from "./SecondaryBanner";
import "../App.css";
import "../index.css";
import SecondaryBottomBar from "./SecondaryBottomBar";
import Switch from "react-ios-switch";

const EditProfile = () => {
  const [skills, setSkills] = useState(["Mixing", "Connecting", "Producing"]); // Sample skills
  const [newSkill, setNewSkill] = useState("");
  const [isNewsAccount, setNewsAccount] = useState(false);

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const deleteSkill = (skillToDelete) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };

  const handleSkillChange = (event) => {
    setNewSkill(event.target.value);
  };

  const handleNewsAccountChange = (event) => {
    setNewSkill(event.target.value);
  };
  return (
    <div>
      <SecondaryBanner />
      <div className="edit-profile-container">
        <div className="skills-container">
          <h2>Edit Skills</h2>
          <ul>
            {skills.map((skill, index) => (
              <li key={index}>
                {skill}
                <button
                  className="delete-button"
                  onClick={() => deleteSkill(skill)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newSkill}
            onChange={handleSkillChange}
            placeholder="New skill"
          />
          <button className="cta-button" onClick={addSkill}>
            Add Skill
          </button>
        </div>
        <div className="flex items-center justify-center mb-3">
          <span className="mr-2">News Account</span>
          <Switch
            checked={isNewsAccount}
            onChange={setNewsAccount}
            onColor="#007AFF"
            offColor="#E5E5EA"
          />
        </div>
      </div>
      <SecondaryBottomBar />
    </div>
  );
};
export default EditProfile;
