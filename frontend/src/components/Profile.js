import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { storage, ref, getDownloadURL } from "./firebase";
import axios from "axios";
import MainBanner from "./MainBottomBar";
import MainBottomBar from "./MainBottomBar";
import ProfileBottomBar from "./ProfileBottomBar";
import ProfileBanner from "./ProfileBanner";
import MicroPost from "./MicroPost";

import { useState, useEffect } from "react";

const Banner = (id) => {
  const navigate = useNavigate();
  const handleFeed = () => {
    navigate("/feed");
  };
  return <ProfileBanner id={id} />;
};

const Footer = () => {
  return <ProfileBottomBar />;
};

const Profile = () => {
  const [isRecordLabel, setIsRecordLabel] = useState(false);

  /*Check if is RecordLabel BELOW*/

  /*
  useEffect(() => {
    axios.get(`http://localhost:5001/user/${userId}`)
      .then((response) => {
        setUserProfile(response.data);
        setIsRecordLabel(response.data.isRecordLabel); // Adjust according to your data structure
      })
      .catch((error) => console.error("Failed to fetch user profile:", error));
  }, [userId]);*/

  const location = useLocation();
  const userId = location.state.userId;
  const loggedInId = localStorage.getItem(
    "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
  );
  const [userProfilePic, setUserProfilePic] = useState({
    profilePic: "",
  });
  const [loggedInProfilePic, setLoggedInProfilePic] = useState({
    profilePic: "",
  });
  const [endorsements, setEndorsements] = useState({});
  const [endorsedSkills, setEndorsedSkills] = useState({});
  const [userData, setUserData] = useState({
    // profilePic: "",
    name: "",
    genre: "",
    description: "",
    friends: [],
    blockedUsers: [],
    accountType: null,
    joinedRecordLabels: [],
    recordLabelMembers: [],
    skills: [],
    projects: [],
  });

  const [loggedInData, setLoggedInData] = useState({
    // profilePic: "",
    name: "",
    genre: "",
    description: "",
    friends: [],
    blockedUsers: [],
    accountType: null,
    joinedRecordLabels: [],
    recordLabelMembers: [],
    skills: [],
    projects: [],
  });
  const [userPosts, setUserPosts] = useState([]);

  const [userSkills, setUserSkills] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5001/user/${userId}`)
      .then((res) => {
        // Process the user data here if the response was successful (status 200)
        console.log("got user pfp");
        console.log(res.data);
        setUserProfilePic(res.data); // Update state with user data
        console.log("PFP:");
        console.log(userProfilePic.profilePic);
        console.log(res.data.endorsed);
        res.data.endorsed.forEach((endorsement) => {
          setEndorsements((prevEndorsements) => {
            return {
              ...prevEndorsements,
              [endorsement.skill]: [endorsement.endorser_realname],
            };
          });
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any errors that occur during the fetch request
      });
  }, []);

  const endorseSkill = (skill) => {
    axios
      //EDIT CALL PATH
      .post(`http://localhost:5001/user/${userId}/endorse`, {
        skill: skill,
        endorser: loggedInId,
      })
      .then((response) => {
        console.log("Skill endorsed successfully:", response.data);
        setEndorsements((prevEndorsements) => {
          return {
            ...prevEndorsements,
            [skill]: prevEndorsements[skill]
              ? [...prevEndorsements[skill], loggedInData.realname]
              : [loggedInData.realname],
          };
        });
      })
      .catch((error) => {
        console.error("Error endorsing skill:", error);
      });

    setEndorsedSkills((prevEndorsedSkills) => ({
      ...prevEndorsedSkills,
      [skill]: true, // Set the endorsed state to true for the skill
    }));
  };

  const revokeEndorsement = (skill) => {
    axios
      .delete(
        `http://localhost:5001/user/${userId}/endorse/${skill}/${loggedInId}`
      )
      .then((response) => {
        console.log("Skill endorsed successfully:", response.data);
        setEndorsements((prevEndorsements) => {
          return {
            ...prevEndorsements,
            [skill]: prevEndorsements[skill].filter(
              (endorser) => endorser !== loggedInData.realname
            ),
          };
        });
      })
      .catch((error) => {
        console.error("Error revoking endorsement skill:", error);
      });
  };

  const toggleEndorseSkill = (skill) => {
    // Check the current endorsement state for the skill
    const hasEndorsed = endorsedSkill(skill);

    // Update state to reflect the new endorsement status
    setEndorsedSkills((prevEndorsedSkills) => ({
      ...prevEndorsedSkills,
      [skill]: !hasEndorsed,
    }));

    // Here you would normally send a request to your backend to add or remove the endorsement
    // Add API call here to handle the backend update
    if (hasEndorsed) {
      revokeEndorsement(skill);
    }

    if (!hasEndorsed) {
      endorseSkill(skill);
    }
    console.log(
      hasEndorsed ? "Retracting endorsement for" : "Endorsing",
      skill
    );
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5001/user/${loggedInId}`)
      .then((res) => {
        // Process the user data here if the response was successful (status 200)
        console.log("got loggedIn pfp");
        setLoggedInProfilePic(res.data); // Update state with user data
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any errors that occur during the fetch request
      });
  }, []);
  const fetchUserAndLoggedData = () => {
    axios
      .get(`http://localhost:5001/user/${userId}`)
      .then((res) => {
        // Process the user data here if the response was successful (status 200)
        console.log("got user data");
        setUserData(res.data); // Update state with user data
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any errors that occur during the fetch request
      });

    axios
      .get(`http://localhost:5001/user/${loggedInId}`)
      .then((res) => {
        // Process the user data here if the response was successful (status 200)
        console.log("got loggedIn data");
        setLoggedInData(res.data); // Update state with user data
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any errors that occur during the fetch request
      });
  };
<<<<<<< Updated upstream
=======
  const fetchAffiliationListData = () => {
    if (userData.accountType === 0) {
      userData.joinedRecordLabels.forEach((labelId) => {
        axios
          .get(`http://localhost:5001/user/${labelId}`)
          .then((labelRes) => {
            const { uid, profilePic, realname } = labelRes.data;
            const picRef = ref(storage, "user/" + profilePic);
            getDownloadURL(picRef)
              .then((url) => {
                setAffiliationArray((prevArr) => [
                  ...prevArr,
                  { uid, profilePic, realname, url },
                ]);
              })
              .catch((error) => {
                console.error("Error getting pfp url:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching affiliation data1:", error);
          });
      });
    } else if (userData.accountType === 1) {
      userData.recordLabelMembers.forEach((memberId) => {
        axios
          .get(`http://localhost:5001/user/${memberId}`)
          .then((memberRes) => {
            const { uid, profilePic, realname } = memberRes.data;
            const picRef = ref(storage, "user/" + profilePic);
            getDownloadURL(picRef)
              .then((url) => {
                setAffiliationArray((prevArr) => [
                  ...prevArr,
                  { uid, profilePic, realname },
                ]);
              })
              .catch((error) => {
                console.error("Error getting pfp url:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching affiliation data1:", error);
          });
      });
    }
    if (loggedInData.accountType === 0) {
      loggedInData.joinedRecordLabels.forEach((labelId) => {
        axios
          .get(`http://localhost:5001/user/${labelId}`)
          .then((labelRes) => {
            const { uid, profilePic, realname } = labelRes.data;
            const picRef = ref(storage, "user/" + profilePic);
            getDownloadURL(picRef)
              .then((url) => {
                setAffiliationArray((prevArr) => [
                  ...prevArr,
                  { uid, profilePic, realname },
                ]);
              })
              .catch((error) => {
                console.error("Error getting pfp url:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching affiliation data1:", error);
          });
      });
    } else if (loggedInData.accountType === 1) {
      loggedInData.recordLabelMembers.forEach((memberId) => {
        axios
          .get(`http://localhost:5001/user/${memberId}`)
          .then((memberRes) => {
            const { uid, profilePic, realname } = memberRes.data;
            const picRef = ref(storage, "user/" + profilePic);
            getDownloadURL(picRef)
              .then((url) => {
                setAffiliationArray((prevArr) => [
                  ...prevArr,
                  { uid, profilePic, realname },
                ]);
              })
              .catch((error) => {
                console.error("Error getting pfp url:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching affiliation data1:", error);
          });
      });
    }
  };
>>>>>>> Stashed changes
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8282");
    ws.onmessage = (event) => {
      fetchUserAndLoggedData();
      console.log("fetched");
    };
    fetchUserAndLoggedData();
<<<<<<< Updated upstream
=======
    fetchAffiliationListData();
>>>>>>> Stashed changes
  }, []);
  const handleConnect = () => {
    //console.log(id);
    console.log(userId);
    console.log(
      localStorage.getItem("actualUserIdBecauseWilliamYongUkKwonIsAnnoying")
    );
    axios
      .post(
        `http://localhost:5001/user/${localStorage.getItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
        )}/friends`,
        { friend: userId }
      )
      .then((response) => {
        console.log("Friend added successfully:", response.data);
        // Optionally, update the UI or handle success
      })
      .catch((error) => {
        console.error("Error adding friend:", error);
        // Optionally, handle the error or revert local state changes
      });
  };

  const handleJoinLabel = () => {
    axios
      .post(
        `http://localhost:5001/user/${localStorage.getItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
        )}/joinedLabels`,
        { labelId: userId }
      )
      .then((response) => {
        console.log("Label added successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding label:", error);
      });
  };

  const handleLeaveLabel = () => {
    axios
      .delete(
        `http://localhost:5001/user/${localStorage.getItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
        )}/joinedLabels/${userId}`
      )
      .then((response) => {
        console.log("Label removed successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error removing label:", error);
      });
  };

  const handleAddUserToLabel = () => {
    axios
      .post(`http://localhost:5001/user/${userId}/labelMembers`, {
        joiner: loggedInId,
      })
      .then((response) => {
        console.log("User added to label successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding user to label:", error);
      });
  };

  const handleRemoveUserFromLabel = () => {
    axios
      .delete(`http://localhost:5001/user/${userId}/labelMembers/${loggedInId}`)
      .then((response) => {
        console.log("User removed from label successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error removing user from label:", error);
      });
  };

  const handleBlock = () => {
    //console.log(id);
    console.log("Handle Block");
    console.log(
      localStorage.getItem("actualUserIdBecauseWilliamYongUkKwonIsAnnoying")
    );
    axios
      .post(
        `http://localhost:5001/user/${localStorage.getItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
        )}/blockedUsers`,
        { blockee: userId }
      )
      .then((response) => {
        console.log("User blocked successfully:", response.data);
        // Optionally, update the UI or handle success
      })
      .catch((error) => {
        console.error("Error blocking user:", error);
        // Optionally, handle the error or revert local state changes
      });
    // also remove the user from the account they block's friends array
    axios
      .delete(
        `http://localhost:5001/user/${userId}/friends/${localStorage.getItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
        )}`
      )
      .then((response) => {
        console.log(
          "Removed from blockee's friends successfully:",
          response.data
        );
        // Optionally, update the UI or handle success
      })
      .catch((error) => {
        console.error("Error removing from blockee's friends:", error);
        // Optionally, handle the error or revert local state changes
      });
    // also also unfriend the user
    axios
      .delete(
        `http://localhost:5001/user/${localStorage.getItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
        )}/friends/${userId}`
      )
      .then((response) => {
        console.log("Friend deleted successfully:", response.data);
        // Optionally, update the UI or handle success
      })
      .catch((error) => {
        console.error("Error deleting friend:", error);
        // Optionally, handle the error or revert local state changes
      });
    axios
      .delete(
        `http://localhost:5001/user/${localStorage.getItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
        )}/friends/${userId}`
      )
      .then((response) => {
        console.log("Friend deleted successfully:", response.data);
        // Optionally, update the UI or handle success
      })
      .catch((error) => {
        console.error("Error deleting friend:", error);
        // Optionally, handle the error or revert local state changes
      });
  };

  const handleRemoveConnect = () => {
    // Make API call to delete friend from the user
    axios
      .delete(
        `http://localhost:5001/user/${localStorage.getItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
        )}/friends/${userId}`
      )
      .then((response) => {
        console.log("Friend deleted successfully:", response.data);
        // Optionally, update the UI or handle success
      })
      .catch((error) => {
        console.error("Error deleting friend:", error);
        // Optionally, handle the error or revert local state changes
      });
  };

  const handleUnblock = () => {
    // Make API call to delete block from the user
    axios
      .delete(
        `http://localhost:5001/user/${localStorage.getItem(
          "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
        )}/blockedUsers/${userId}`
      )
      .then((response) => {
        console.log("User unblocked successfully:", response.data);
        // Optionally, update the UI or handle success
      })
      .catch((error) => {
        console.error("Error unblocking user:", error);
        // Optionally, handle the error or revert local state changes
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5001/post/owner/${userId}`)
      .then((res) => {
        console.log("got posts");
        console.log(res.data);
        setUserPosts(res.data);
      })
      .catch((error) => {
        console.error("Error getting posts:", error);
      });
  }, []);

  const Gallery = () => {
    return (
      <div className="w-1/3 h-full text-center pt-28 border-2 border-black">
        <div>Gallery</div>
        <div className="overflow-y-auto w-full h-full flex flex-col items-center pt-5">
          <div className="w-5/12 h-52 bg-gray-300 border-2 border-black mb-5">
            <p>HI</p>
          </div>
        </div>
      </div>
    );
  };

  const Activity = () => {
    return (
      <div className="w-1/3 flex-row h-auto overflow-y-hidden">
        <div className="h-full text-center pt-28 border-2 border-solid border-#283e4a bg-gradient-to-br from-emerald-950 to-gray-500 rounded-md shadow-lg overflow-y-scroll">
          {/* <div>Activity</div>
        <div className="overflow-y-auto w-full h-full flex flex-col items-center pt-5">
          <div className="w-5/12 h-52 bg-gray-300 border-2 border-black mb-5">
            <p>HI</p>
          </div>
        </div> */}
          {userPosts.map((post, index) => (
            // <Card key={index} post={post} />
            <MicroPost key={index} postParam={post} />
          ))}
        </div>
      </div>
    );
  };

  const endorsedSkill = (skill) => {
    if (endorsements[skill]) {
      return endorsements[skill].includes(loggedInData.realname);
    }
    return false;
  };

  const ProfileInfo = () => {
    const [isHovered, setIsHovered] = useState(false);

    // // check for profile pic
    if (!userProfilePic.profilePic || userProfilePic.profilePic === null) {
      userProfilePic.profilePic = "No Profile Picture";
    }

    // check for null skills and description and projects
    if (!userData.skills || userData.skills.length === 0) {
      userData.skills = [];
    } else {
      setUserSkills(userData.skills);
      console.log(userData.skills);
    }

    if (userData.description === null) {
      userData.description = "No Description";
    }

    if (!userData.projects || userData.projects.length === 0) {
      userData.projects = "No Projects";
    }

    // GET IMAGE FROM FIREBASE STORAGE
    const [image, setImage] = useState("");
    useEffect(() => {
      const picRef = ref(storage, "user/" + userProfilePic.profilePic);
      getDownloadURL(picRef)
        .then((url) => {
          setImage(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
    console.log(userData.skills);
<<<<<<< Updated upstream
=======
    const profileClicked = (id) => {
      const userId = id;
      console.log("navigate to " + userId);

      navigate("/profile", { state: { userId } });
    };
>>>>>>> Stashed changes
    return (
      <div className="h-full pt-28 flex flex-col items-center">
        {userProfilePic.profilePic === "No file chosen" ? (
          <div className="w-40 h-40 bg-gray-300"></div>
        ) : (
          <img className="w-40" src={image} />
        )}
        <div>{userData.realname}</div>
        <div>{userData.genre}</div>
        <div>{userData.description}</div>
        <div>{userData.projects}</div>
        <div>Endorsements</div>
<<<<<<< Updated upstream
        <div>{Object.entries(endorsements).map(([skill, endorsers]) => {
          return (
            <div key={skill}>
              <div>Skill: {skill}</div>
              <div>Endorses: {endorsers.length > 1 ? endorsers.map((endorser) => ` ${endorser} ,`) : endorsers[0]}
              </div>
            </div>
          );
        })}</div>
=======

        {userData.accountType === 0 ? (
          <div>
            {Object.entries(endorsements).map(([skill, endorsers]) => {
              return (
                <div key={skill}>
                  <div>Skill: {skill}</div>
                  <div>
                    Endorses:{" "}
                    {endorsers.length > 1
                      ? endorsers.map((endorser) => ` ${endorser} ,`)
                      : endorsers[0]}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="flex bg-gray-300">
              {affiliationArray.map((affil, index) => (
                <div
                  key={index}
                  className="flex items-center border-b border-gray-300 p-2"
                >
                  <div>
                    <img
                      src={affil.url}
                      alt={`${affil.realname}`}
                      className="w-12 h-12 rounded-full cursor-pointer"
                      onClick={() => {
                        profileClicked(affil.uid);
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-800 font-semibold">
                      {affil.realname}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
>>>>>>> Stashed changes

        <div className="flex justify-between items-center">
          {userId !== loggedInId &&
          userData.accountType == 0 &&
          loggedInData.accountType == 0 ? (
            userData.friends &&
            userData.friends.includes(loggedInId) &&
            loggedInData.friends &&
            loggedInData.friends.includes(userId) ? (
              <>
                <div>
                  <button
                    onClick={() => handleRemoveConnect()}
                    className="button"
                  >
                    Remove Connection{" "}
                  </button>
                </div>
              </>
            ) : (!userData.friends || !userData.friends.includes(loggedInId)) &&
              loggedInData.friends &&
              loggedInData.friends.includes(userId) ? (
              <>
                <div>
                  <button
                    onClick={() => handleRemoveConnect()}
                    className="button bg-gray-300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered ? "Rescind?" : "Pending"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <button onClick={() => handleConnect()} className="button">
                    {console.log(userData.friends)}
                    Connect{" "}
                  </button>
                </div>
              </>
            )
          ) : (
            <div></div>
          )}

          {userId !== loggedInId &&
          userData.accountType == 1 &&
          loggedInData.accountType == 0 ? (
            userData.recordLabelMembers &&
            userData.recordLabelMembers.includes(loggedInId) &&
            loggedInData.joinedRecordLabels &&
            loggedInData.joinedRecordLabels.includes(userId) ? (
              <>
                <div>
                  <button onClick={() => handleLeaveLabel()} className="button">
                    Remove Label Affiliation{" "}
                  </button>
                </div>
              </>
            ) : (!userData.recordLabelMembers ||
                !userData.recordLabelMembers.includes(loggedInId)) &&
              loggedInData.joinedRecordLabels &&
              loggedInData.joinedRecordLabels.includes(userId) ? (
              <>
                <div>
                  <button
                    onClick={() => handleLeaveLabel()}
                    className="button bg-gray-300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered
                      ? "Rescind Label Join Request?"
                      : "Label Join Request Pending"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <button onClick={() => handleJoinLabel()} className="button">
                    {console.log(userData.friends)}
                    Request to Join Label{" "}
                  </button>
                </div>
              </>
            )
          ) : (
            <div></div>
          )}

          {userId !== loggedInId &&
          userData.accountType == 0 &&
          loggedInData.accountType == 1 ? (
            userData.joinedRecordLabels &&
            userData.joinedRecordLabels.includes(loggedInId) &&
            loggedInData.recordLabelMembers &&
            loggedInData.recordLabelMembers.includes(userId) ? (
              <>
                <div>
                  <button
                    onClick={() => handleRemoveUserFromLabel()}
                    className="button"
                  >
                    Deny Label Affiliation{" "}
                  </button>
                </div>
              </>
            ) : (!userData.joinedRecordLabels ||
                !userData.joinedRecordLabels.includes(loggedInId)) &&
              loggedInData.recordLabelMembers &&
              loggedInData.recordLabelMembers.includes(userId) ? (
              <>
                <div>
                  <button
                    onClick={() => handleRemoveUserFromLabel()}
                    className="button bg-gray-300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered
                      ? "Rescind Label Join Offer?"
                      : "Label Join Offer Outgoing"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <button
                    onClick={() => handleAddUserToLabel()}
                    className="button"
                  >
                    {console.log(userData.joinedRecordLabels)}
                    Offer to Join Label{" "}
                  </button>
                </div>
              </>
            )
          ) : (
            <div></div>
          )}

          {userId === loggedInId ? (
            <div></div>
          ) : !loggedInData.blockedUsers.includes(userId) ? (
            <>
              <div>
                <button onClick={() => handleBlock()} className="button">
                  Block{" "}
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <button
                  onClick={() => handleUnblock()}
                  className="button bg-gray-300"
                >
                  Unblock{" "}
                </button>
              </div>
            </>
          )}
        </div>
        <div className="edit-profile-container">
          <div className="skills-profile">
            <h2>Skills</h2>
            <ul>
              {userData.skills.length > 0
                ? userData.skills.map((skill, index) => (
                    <li key={index} className="skill-list-item">
                      <span className="skill-label">{skill}</span>
                      <button
                        onClick={() => {
                          toggleEndorseSkill(skill);
                        }}
                        className={`endorse-button ${
                          endorsedSkills[skill] ? "endorsed" : ""
                        }`}
                      >
                        {endorsedSkill(skill)
                          ? "Revoke Endorsement"
                          : "Endorse"}
                      </button>
                    </li>
                  ))
                : "No skills listed"}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  const BlockedPage = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <h1 className="card">You have been blocked by {userData.realname}</h1>
        </div>

        <div className="mt-4">
          {!loggedInData.blockedUsers.includes(userId) ? (
            <button onClick={() => handleBlock()} className="button">
              Block
            </button>
          ) : (
            <button
              onClick={() => handleUnblock()}
              className="button bg-gray-300"
            >
              Unblock
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Banner id={userId} />

      {!userData.blockedUsers.includes(loggedInId) ? (
        <>
          <div className="w-full h-full flex justify-around items-center">
            <Gallery />
            <ProfileInfo />
            <Activity />
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-full flex justify-around items-center">
            <BlockedPage />
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Profile;
