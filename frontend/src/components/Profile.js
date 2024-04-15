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
  const navigate = useNavigate();

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
  const [affiliationArray, setAffiliationArray] = useState(new Set());
  const [friendArray, setFriendArray] = useState(new Set());


  const [userData, setUserData] = useState({
    // profilePic: "",
    name: "",
    genre: "",
    description: "",
    friends: [],
    blockedUsers: [],
    accountType: 0,
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
    accountType: 0,
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
              [endorsement.skill]: [endorsement.endorser_realname]
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
      .post(
        `http://localhost:5001/user/${userId}/endorse`, {
        skill: skill,
        endorser: loggedInId,
      }
      )
      .then((response) => {
        console.log("Skill endorsed successfully:", response.data);
        setEndorsements((prevEndorsements) => {
          return {
            ...prevEndorsements,
            [skill]: prevEndorsements[skill] ? [...prevEndorsements[skill], loggedInData.realname] : [loggedInData.realname]
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
      .delete(`http://localhost:5001/user/${userId}/endorse/${skill}/${loggedInId}`)
      .then((response) => {
        console.log("Skill endorsed successfully:", response.data);
        setEndorsements((prevEndorsements) => {
          return {
            ...prevEndorsements,
            [skill]: prevEndorsements[skill].filter((endorser) => endorser !== loggedInData.realname)
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
        console.log(res.data.accountType)
        setUserData(res.data); // Update state with user data
        console.log(userData.accountType)
        if (res.data.accountType === 1) {
          res.data.recordLabelMembers.forEach(friendId => {
            console.log(friendId)
            axios.get(`http://localhost:5001/user/${friendId}`)
              .then((friendRes) => {
                const { uid, profilePic, realname } = friendRes.data;
                const picRef = ref(storage, "user/" + profilePic);
                for (const affil of affiliationArray) {
                  if (affil.uid === friendId) {
                    affiliationArray.delete(affil)
                  }
                }
                if (friendRes.data.joinedRecordLabels.includes(userId)) {
                  getDownloadURL(picRef).then((url) => {
                    //if (!affiliationArray.has({ uid, profilePic, realname, url })) {
                    //setAffiliationArray(prevArr => [...prevArr, { uid, profilePic, realname, url }]);
                    setAffiliationArray(affiliationArray.add({ uid, profilePic, realname, url }))
                    //}
                    console.log("aff array")
                    console.log(affiliationArray)
                  }).catch(error => {
                    //if (!affiliationArray.has({ uid, profilePic, realname})) {
                    const defPic = ref(storage, "user/" + 'No file chosen.png')
                    getDownloadURL(defPic).then((url2) => {
                      setAffiliationArray(affiliationArray.add({ uid, profilePic, realname, url2 }))

                    })
                      .catch(error => {
                        console.error("Error getting pfp url:", error);

                      })
                    setAffiliationArray(affiliationArray.add({ uid, profilePic, realname, }))

                    //setAffiliationArray(prevArr => [...prevArr, { uid, profilePic, realname}]);
                    //}
                    console.error("Error getting pfp url:", error);
                  });
                }
              })
              .catch((error) => {
                console.error("Error fetching friend data:", error);
              });
          });
        }
        else {
          res.data.joinedRecordLabels.forEach(friendId => {
            console.log(friendId)
            axios.get(`http://localhost:5001/user/${friendId}`)
              .then((friendRes) => {
                const { uid, profilePic, realname } = friendRes.data;
                const picRef = ref(storage, "user/" + profilePic);
                for (const affil of affiliationArray) {
                  if (affil.uid === friendId) {
                    affiliationArray.delete(affil)
                  }
                }
                if (friendRes.data.recordLabelMembers.includes(userId)) {
                  getDownloadURL(picRef).then((url) => {
                    //if (!affiliationArray.has({ uid, profilePic, realname, url })) {
                    //setAffiliationArray(prevArr => [...prevArr, { uid, profilePic, realname, url }]);
                    setAffiliationArray(affiliationArray.add({ uid, profilePic, realname, url }))
                    //}
                    console.log("aff array")
                    console.log(affiliationArray)
                  }).catch(error => {
                    //if (!affiliationArray.has({ uid, profilePic, realname})) {
                    const defPic = ref(storage, "user/" + 'No file chosen.png')
                    getDownloadURL(defPic).then((url2) => {
                      setAffiliationArray(affiliationArray.add({ uid, profilePic, realname, url2 }))

                    })
                      .catch(error => {
                        console.error("Error getting pfp url:", error);

                      })
                    setAffiliationArray(affiliationArray.add({ uid, profilePic, realname, }))

                    //setAffiliationArray(prevArr => [...prevArr, { uid, profilePic, realname}]);
                    //}
                    console.error("Error getting pfp url:", error);
                  });
                }
              })
              .catch((error) => {
                console.error("Error fetching friend data:", error);
              });
          });
          res.data.friends.forEach(friendId => {
            console.log(friendId)
            axios.get(`http://localhost:5001/user/${friendId}`)
              .then((friendRes) => {
                const { uid, profilePic, realname } = friendRes.data;
                const picRef = ref(storage, "user/" + profilePic);
                for (const affil of friendArray) {
                  if (affil.uid === friendId) {
                    friendArray.delete(affil)
                  }
                }
                if (friendRes.data.friends.includes(userId)) {
                  getDownloadURL(picRef).then((url) => {
                    //if (!affiliationArray.has({ uid, profilePic, realname, url })) {
                    //setAffiliationArray(prevArr => [...prevArr, { uid, profilePic, realname, url }]);
                    setFriendArray(friendArray.add({ uid, profilePic, realname, url }))
                    //}
                    console.log("aff array")
                    console.log(friendArray)
                  }).catch(error => {
                    //if (!affiliationArray.has({ uid, profilePic, realname})) {
                    const defPic = ref(storage, "user/" + 'No file chosen.png')
                    getDownloadURL(defPic).then((url2) => {
                      setFriendArray(friendArray.add({ uid, profilePic, realname, url2 }))

                    })
                      .catch(error => {
                        console.error("Error getting pfp url:", error);

                      })
                    setFriendArray(friendArray.add({ uid, profilePic, realname, }))

                    //setAffiliationArray(prevArr => [...prevArr, { uid, profilePic, realname}]);
                    //}
                    console.error("Error getting pfp url:", error);
                  });
                }
              })
              .catch((error) => {
                console.error("Error fetching friend data:", error);
              });
          });
        }
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
  // const fetchAffiliationListData = () => {
  //   console.log("Fetching affiliation data")
  //   console.log(userData.accountType)
  //  if (userData.accountType === 0) {
  //   // userData.joinedRecordLabels.forEach(labelId => {console.log(labelId)
  //   //   axios.get(`http://localhost:5001/user/${labelId}`)
  //   //     .then((labelRes) => {
  //   //       console.log(labelRes)
  //   //       const {uid, profilePic, realname} = labelRes.data;
  //   //       const picRef = ref(storage, "user/" + profilePic);
  //   //       getDownloadURL(picRef).then((url) => {
  //   //         if (labelRes.data.recordLabelMembers.includes(userId)) {
  //   //           setAffiliationArray(prevArr => [...prevArr, {uid, profilePic, realname, url}]);
  //   //         }
  //   //       }).catch(error => {
  //   //         console.error("Error getting pfp url:", error);
  //   //       });
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error fetching affiliation data1:", error);
  //   //   });
  //   // });
  //  }
  //  else if (userData.accountType === 1) {
  //   console.log(userId)
  //   userData.recordLabelMembers.forEach(memberId => {console.log(memberId)
  //     // axios.get(`http://localhost:5001/user/${memberId}`)
  //     //   .then((memberRes) => {
  //     //     console.log(memberRes)

  //     //     const {uid, profilePic, realname} = memberRes.data;
  //     //     const picRef = ref(storage, "user/" + profilePic);
  //     //     getDownloadURL(picRef).then((url) => {
  //     //       if (memberRes.data.joinedRecordLabels.includes(userId)) {
  //     //         setAffiliationArray(prevArr => [...prevArr, {uid, profilePic, realname, url}]);
  //     //       }
  //     //     }).catch(error => {
  //     //       console.error("Error getting pfp url:", error);
  //     //     });
  //     // })
  //     // .catch((error) => {
  //     //   console.error("Error fetching affiliation data1:", error);
  //     // });
  //   });
  //  } 
  //  /*if (loggedInData.accountType === 0) {
  //   loggedInData.joinedRecordLabels.forEach(labelId => {
  //     axios.get(`http://localhost:5001/user/${labelId}`)
  //       .then((labelRes) => {
  //         const {uid, profilePic, realname} = labelRes.data;
  //         const picRef = ref(storage, "user/" + profilePic);
  //         getDownloadURL(picRef).then((url) => {
  //           setAffiliationArray(prevArr => [...prevArr, {uid, profilePic, realname, url}]);
  //         }).catch(error => {
  //           console.error("Error getting pfp url:", error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching affiliation data1:", error);
  //     });
  //   });
  //  }
  //  else if (loggedInData.accountType === 1) {
  //   loggedInData.recordLabelMembers.forEach(memberId => {
  //     axios.get(`http://localhost:5001/user/${memberId}`)
  //       .then((memberRes) => {
  //         const {uid, profilePic, realname} = memberRes.data;
  //         const picRef = ref(storage, "user/" + profilePic);
  //         getDownloadURL(picRef).then((url) => {
  //           setAffiliationArray(prevArr => [...prevArr, {uid, profilePic, realname, url}]);
  //         }).catch(error => {
  //           console.error("Error getting pfp url:", error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching affiliation data1:", error);
  //     });
  //   });
  //  }
  //  */
  // }
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8282");
    ws.onmessage = (event) => {
      fetchUserAndLoggedData();
      //fetchAffiliationListData();
      console.log("fetched");
    };
    fetchUserAndLoggedData();
    //fetchAffiliationListData();

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
        `http://localhost:5001/user/${loggedInId}/joinedLabels`,
        { labelId: userId }
      )
      .then((response) => {
        console.log("Label added successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding label:", error);
      });
  }

  const handleLeaveLabel = () => {
    axios
      .delete(
        `http://localhost:5001/user/${loggedInId}/joinedLabels/${userId}`,
      )
      .then((response) => {
        console.log("Label removed successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error removing label:", error);
      });
  }
  const handleDenyFromLabel = () => {
    axios
      .delete(
        `http://localhost:5001/user/${userId}/joinedLabels/${loggedInId}`,
      )
      .then((response) => {
        console.log("Label removed successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error removing label:", error);
      });
  }

  const handleAddUserToLabel = () => {
    axios
      .post(
        `http://localhost:5001/user/${loggedInId}/labelMembers`,
        { joiner: userId }
      )
      .then((response) => {
        console.log("User added to label successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding user to label:", error);
      });
  }

  const handleRemoveUserFromLabel = () => {
    axios
      .delete(
        `http://localhost:5001/user/${loggedInId}/labelMembers/${userId}`,
      )
      .then((response) => {
        console.log("User removed from label successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error removing user from label:", error);
      });
  }

  const handleRejectRequestToJoinLabel = () => {
    axios
      .delete(
        `http://localhost:5001/user/${userId}/labelMembers/${loggedInId}`,
      )
      .then((response) => {
        console.log("User removed from label successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error removing user from label:", error);
      });
  }

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
    axios.delete(`http://localhost:5001/user/${localStorage.getItem("actualUserIdBecauseWilliamYongUkKwonIsAnnoying")}/friends/${userId}`)
      .then(response => {
        console.log('Friend deleted successfully:', response.data);
        // Optionally, update the UI or handle success
      })
      .catch(error => {
        console.error('Error deleting friend:', error);
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
  }

  const ProfileInfo = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [showAffiliations, setShowAffiliations] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    // // check for profile pic
    if (!userProfilePic.profilePic || userProfilePic.profilePic === null) {
      userProfilePic.profilePic = "No Profile Picture";
    }
    const handleViewAffiliations = () => {
      setShowAffiliations(!showAffiliations);
    };
    const handleViewFriends = () => {
      setShowFriends(!showFriends);
    };
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
    const profileClicked = (id) => {
      const userId = id;
      console.log("navigate to " + userId);
      navigate("/profile", { state: { userId } });
      window.location.reload();
    };
    return (
      <div className="h-full pt-28 flex flex-col items-center">
        {userProfilePic.profilePic === "No file chosen" ? (
          <div className="w-40 h-40 bg-gray-300"></div>
        ) : (
          <img className="w-40" src={image} />
        )}
        <div>{userData.realname}</div>
        {userData.accountType === 1 && <div>Record Label</div>}
        <div>{userData.genre}</div>
        <div>{userData.description}</div>
        <div>{userData.projects}</div>
        {userData.accountType === 0 ? (<div>
          <button onClick={handleViewFriends}>View Friends</button>

          {showFriends && (friendArray.size > 0 ? (
            <div>
              <div>Friends</div>
              <div className="flex bg-gray-300">
                {[...friendArray].map((affil, index) => (
                  <div key={index} className="flex items-center border-b border-gray-300 p-2">
                    <div>
                      <img
                        onClick={() => { profileClicked(affil.uid) }}
                        src={affil.url}
                        alt={`${affil.realname}`}
                        className="w-12 h-12 rounded-full cursor-pointer"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-800 font-semibold">{affil.realname}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (friendArray.size === 0 && (<div>User does not yet have any affilitations</div>))
          )}

        </div>) : (<></>)
        }
        <div>
          <button onClick={handleViewAffiliations}>View Affiliations</button>

          {showAffiliations && (affiliationArray.size > 0 ? (
            <div>
              <div>Affiliations</div>
              <div className="flex bg-gray-300">
                {[...affiliationArray].map((affil, index) => (
                  <div key={index} className="flex items-center border-b border-gray-300 p-2">
                    <div>
                      <img
                        onClick={() => { profileClicked(affil.uid) }}
                        src={affil.url}
                        alt={`${affil.realname}`}
                        className="w-12 h-12 rounded-full cursor-pointer"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-800 font-semibold">{affil.realname}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (affiliationArray.size === 0 && (<div>User does not yet have any affilitations</div>))
          )}

        </div>

        <div>Endorsements</div>

        {(userData.accountType === 0) ? (
          <div>{Object.entries(endorsements).map(([skill, endorsers]) => {
            return (
              <div key={skill}>
                <div>Skill: {skill}</div>
                <div>Endorsed by: {endorsers.length > 1 ? endorsers.map((endorser) => ` ${endorser} ,`) : endorsers[0]}
                </div>
              </div>
            );
          })}</div>) : (
          <>        </>
        )
        }

        <div className="flex justify-between items-center">
          {(userId !== loggedInId && userData.accountType == 0 && loggedInData.accountType == 0) ? (userData.friends &&
            userData.friends.includes(loggedInId) &&
            loggedInData.friends &&
            loggedInData.friends.includes(userId) ? (
            <>
              <div>
                <button onClick={() => handleRemoveConnect()}
                  className="button">
                  Remove Connection </button>
              </div></>) : (
            ((!userData.friends || !userData.friends.includes(loggedInId)) && (loggedInData.friends && loggedInData.friends.includes(userId))) ?
              (
                <>
                  <div>
                    <button onClick={() => handleRemoveConnect()}
                      className="button bg-gray-300"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}>

                      {isHovered ? "Rescind?" : "Pending"}
                    </button>
                  </div></>

              )
              : (
                <>
                  <div>
                    <button onClick={() => handleConnect()}
                      className="button">
                      {console.log(userData.friends)}
                      Connect </button>
                  </div></>
              )
          )
          ) : (<div></div>)}

          {(userId !== loggedInId && userData.accountType == 1 && loggedInData.accountType == 0) ? (userData.recordLabelMembers &&
            userData.recordLabelMembers.includes(loggedInId) &&
            loggedInData.joinedRecordLabels &&
            loggedInData.joinedRecordLabels.includes(userId) ? (
            <>
              <div>
                <button onClick={() => handleLeaveLabel()}
                  className="button">
                  Remove Label Affiliation </button>
              </div></>) : (
            ((!userData.recordLabelMembers || !userData.recordLabelMembers.includes(loggedInId)) && (loggedInData.joinedRecordLabels && loggedInData.joinedRecordLabels.includes(userId))) ?
              (
                <>
                  <div>
                    <button onClick={() => handleLeaveLabel()}
                      className="button bg-gray-300"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}>

                      {isHovered ? "Rescind Label Join Request?" : "Label Join Request Pending"}
                    </button>
                  </div></>

              )
              : ((userData.recordLabelMembers && userData.recordLabelMembers.includes(loggedInId)) && (!loggedInData.joinedRecordLabels || !loggedInData.joinedRecordLabels.includes(userId)) ?
                (<div className="flex">
                  <button onClick={() => handleRejectRequestToJoinLabel()}
                    className="button bg-red-500">
                    Deny Invite to Join Label </button>
                  <button onClick={() => handleJoinLabel()}
                    className="button bg-green-500">
                    Accept Invite to Join Label </button>
                </div>)
                : (

                  <>
                    <div>
                      <button onClick={() => handleJoinLabel()}
                        className="button">
                        {console.log(userData.friends)}
                        Request to Join Label </button>
                    </div></>
                )
              )
          )
          ) : (<div></div>)}

          {(userId !== loggedInId && userData.accountType == 0 && loggedInData.accountType == 1) ? (userData.joinedRecordLabels &&
            userData.joinedRecordLabels.includes(loggedInId) &&
            loggedInData.recordLabelMembers &&
            loggedInData.recordLabelMembers.includes(userId) ? (
            <>
              <div>
                <button onClick={() => {
                  handleRemoveUserFromLabel();
                  handleDenyFromLabel();
                }}
                  className="button">
                  Deny Label Affiliation </button>
              </div></>) : (
            ((!userData.joinedRecordLabels || !userData.joinedRecordLabels.includes(loggedInId)) && (loggedInData.recordLabelMembers && loggedInData.recordLabelMembers.includes(userId))) ?
              (
                <>
                  <div>
                    <button onClick={() => handleRemoveUserFromLabel()}
                      className="button bg-gray-300"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}>

                      {isHovered ? "Rescind Label Join Offer?" : "Label Join Offer Outgoing"}
                    </button>
                  </div></>

              )
              : ((userData.joinedRecordLabels && userData.joinedRecordLabels.includes(loggedInId)) && (!loggedInData.recordLabelMembers || !loggedInData.recordLabelMembers.includes(userId))) ? (
                <div className="flex">
                  <button onClick={() => handleDenyFromLabel()}
                    className="button bg-red-500">
                    Deny Request to Join Label </button>
                  <button onClick={() => handleAddUserToLabel()}
                    className="button bg-green-500">
                    Accept Request to Join Label </button>
                </div>
              ) : (
                <>
                  <div>
                    <button onClick={() => handleAddUserToLabel()}
                      className="button">
                      Offer to Join Label </button>
                  </div></>
              )

          )
          ) : (<div></div>)}

          {userId === loggedInId ? (
            <div></div>
          ) : (
            (!loggedInData.blockedUsers.includes(userId)) ? (
              <>
                <div>
                  <button onClick={() => handleBlock()}
                    className="button">
                    Block </button>
                </div></>) : (
              <>
                <div>

                  <button onClick={() => handleUnblock()}
                    className="button bg-gray-300">
                    Unblock </button>
                </div></>
            )
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
                    {userId !== loggedInId ? (<><button
                      onClick={() => {
                        toggleEndorseSkill(skill);
                      }}
                      className={`endorse-button ${endorsedSkills[skill] ? "endorsed" : ""
                        }`}
                    >
                      {endorsedSkill(skill) ? "Revoke Endorsement" : "Endorse"}
                    </button></>) : (<></>)}
                  </li>
                ))
                : "No skills listed"}
            </ul>
          </div>
        </div>

        <div className="edit-profile-container">
          <div className="skills-profile">
            <h2>Hashtags</h2>
            <ul>
              {userData.hashtags && userData.hashtags.length > 0
                ? userData.hashtags.map((hashtag) => (
                  <li key={hashtag} className="skill-list-item">
                    <span className="skill-label">{hashtag}</span>
                  </li>
                ))
                : `No hashtags`}
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
          <h1 className="card">
            You have been blocked by {userData.realname}
          </h1>
        </div>

        <div className="mt-4">
          {!loggedInData.blockedUsers.includes(userId) ? (
            <button onClick={() => handleBlock()} className="button">
              Block
            </button>
          ) : (
            <button onClick={() => handleUnblock()} className="button bg-gray-300">
              Unblock
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Banner id={userId} />

      {!userData.blockedUsers.includes(loggedInId) ? (
        <><div className="w-full h-full flex justify-around items-center">
          <Gallery />
          <ProfileInfo />
          <Activity />
        </div></>) : (
        <><div className="w-full h-full flex justify-around items-center">
          <BlockedPage />

        </div></>
      )
      }
      <Footer />
    </div>
  );
};

export default Profile;
