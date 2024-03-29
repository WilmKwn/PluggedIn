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
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isNewsAccount, setNewsAccount] = useState(false);
  const userId = localStorage.getItem("userId");
 
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userId) {
      try {
        const updatedData = {
          skills: skills,
          newsAccount: isNewsAccount,
        };

        navigate("/profile");
      } catch (error) {
        console.error("Error updating profile catch:", error);
      }
    }
  };
  useEffect(() => {
    axios.get(`http://localhost:5001/user/${userId}`)
      .then((res) => {
        console.log('got user data');
        console.log(res.data.skills)
        setSkills(res.data.skills);
      })
      .catch(error => {
        console.error('Error getting user data:', error);
      });
  }, []);

  const addSkill = () => {
    console.log(newSkill)
    if (newSkill && !skills.includes(newSkill)) {
      // Update the local state first
      setSkills([...skills, newSkill]);

      // Make API call to add skill to the user
      axios.post(`http://localhost:5001/user/${userId}/skills`, { skill: newSkill })
        .then(response => {
          console.log('Skill added successfully:', response.data);
          // Optionally, update the UI or handle success
        })
        .catch(error => {
          console.error('Error adding skill:', error);
          // Optionally, handle the error or revert local state changes
        });
        setNewSkill("");

    }

  };

  const deleteSkill = (skillToDelete) => {
    // Update the local state first
    setSkills(skills.filter((skill) => skill !== skillToDelete));

    // Make API call to delete skill from the user
    axios.delete(`http://localhost:5001/user/${userId}/skills/${skillToDelete}`)
      .then(response => {
        console.log('Skill deleted successfully:', response.data);
        // Optionally, update the UI or handle success
      })
      .catch(error => {
        console.error('Error deleting skill:', error);
        // Optionally, handle the error or revert local state changes
      });
  };

  const handleSkillChange = (event) => {
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
        <button className="cta-button" onClick={handleSubmit}>
          Complete Edit
        </button>
      </div>
      <SecondaryBottomBar />
    </div>
  );
};
export default EditProfile;
