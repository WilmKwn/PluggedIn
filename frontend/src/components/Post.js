import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from 'react-modal';

import "../App.css";
import axios from "axios";
import { storage, ref, getDownloadURL, auth } from "./firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";

const Post = ({ postParam, input = " "}) => {
  useEffect(() => {
    const arr = input.split(" ");
    if (arr[0] === "like" && arr[1] == "post") {
      handleLike();
    } else if (arr[0] === "dislike" && arr[1] == "post") {
      handleDislike();
    } else if (arr[0] === "repost" && arr[1] == "post") {
      handleRepost();
    } else if (arr[0] === "laugh" && arr[1] == "post") {
      handleLaugh();
    }
  }, [input]);

  const [post] = useState(postParam);
  const navigate = useNavigate();
  // Dummy user details
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();
  const loggedInId = localStorage.getItem(
    "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
  );
  const [userData, setUserData] = useState({
    blockedUsers: [],
  });
  const [loggedInData, setLoggedInData] = useState({
    blockedUsers: [],
  })
  const [userProfilePic, setUserProfilePic] = useState(
    "https://via.placeholder.com/150"
  );
  useEffect(() => {
    axios
      .get(`http://localhost:5001/user/${loggedInId}`)
      .then((res) => {
        console.log("got user data");
        setUserData(res.data); // Update state with user data
      })
      .catch((error) => {
        // console.error("Error:", error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`http://localhost:5001/user/${loggedInId}`)
      .then((res) => {
        console.log("got loggedIn data");
        setLoggedInData(res.data); // Update state with user data
      })
      .catch((error) => {
        console.error("Error:", error);
      })
  }, []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const openModal = (event) => {
    // const oButt = document.getElementById("optionsButt");
    // const oButtRect = oButt.getBoundingClientRect();
    const oButt = event.currentTarget;
    const oButtRect = oButt.getBoundingClientRect();
    // console.log(oButtRect.bottom)
    // console.log(window.scrollY)
    //const modalTop = oButtRect.bottom + Math.floor(window.scrollY / window.innerHeight) * window.innerHeight;
    const modalTop = oButtRect.bottom;
    // console.log(modalTop);
    const modalLeft = oButtRect.left + window.scrollX;
    setModalPosition({ top: modalTop, left: modalLeft });
    setModalOpen(true)
  };
  const closeModal = () => setModalOpen(false);
  const modalStyles = {
    content: {
      position: 'relative',
      bottom: 0,
      top: `${modalPosition.top}px`,
      left: `${modalPosition.left}px`,
      marginRight: '10px',
      marginBottom: '10px',
      border: 'none',
      background: 'white',
      overflow: 'hidden',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '5px',
      outline: 'none',
      padding: '0px',
      width: '300px',
      height: '200px'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  };
  const [likeStatus, setLikeStatus] = useState(false);
  const [dislikeStatus, setDislikeStatus] = useState(false);
  const [laughStatus, setLaughStatus] = useState(false);
  const [repostStatus, setRepostStatus] = useState(false);
  const [hiddenBy, setHiddenBy] = useState([])
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [laughs, setLaughs] = useState(0);
  const [reposts, setReposts] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [media, setMedia] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [mediaExtension, setMediaExtension] = useState("");
  const [originalCreator, setOriginalCreator] = useState("");

  useEffect(() => {
    if (post.media) {
      const extension = post.media.split(".").pop().toLowerCase();
      setMediaExtension(extension);
      if (["mp4", "webm", "ogg", "mp3", "wav"].includes(extension)) {
        setMediaType("video");
      } else {
        setMediaType("image");
      }
      const picRef = ref(storage, "post/" + post.media);
      getDownloadURL(picRef)
        .then((url) => {
          setMedia(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setComments(post.comments.map((comment) => comment.text));
  }, [post]);

  useEffect(() => {
    setComments(post.comments);
    setLikes(post.reactions.likes);
    setLaughs(post.reactions.laughs);
    setDislikes(post.reactions.dislikes);
    setReposts(post.reactions.reposts);
    setHiddenBy(post.hiddenBy);

  }, [post.media, post.comments]);


  const handleLike = () => {
    setLikeStatus(!likeStatus);
    const newLikes = likeStatus ? likes - 1 : likes + 1;
    setLikes(newLikes);
    let newDislikes = dislikes;
    let newLaughs = laughs;
    if (dislikeStatus) {
      newDislikes = dislikes - 1;
      setDislikes(newDislikes);
      setDislikeStatus(false);
    }
    if (laughStatus) {
      newLaughs = laughs - 1;
      setLaughs(newLaughs);
      setLaughStatus(false);
    }

    const reactions = {
      likes: newLikes,
      dislikes: newDislikes,
      laughs: newLaughs,
      reposts: reposts,
    }
    try {
      axios.put(`http://localhost:5001/post/${post._id}`, { reactions });
      axios.get(`http://localhost:5001/user/${post.owner}`).then(res => {
        const data = res.data;
        const notis = data.notifications;
        notis.push(`${loggedInData.realname} liked your post: ${post.title}`);
        const newData = {
          ...data,
          notis
        }
        axios.put(`http://localhost:5001/user/${post.owner}`, newData);
      }).catch(err => console.log(err));
    } catch (err) {
      console.log(err.message);
    }
  };

  const profileClicked = (id) => {
    const userId = id;
    console.log("navigate to " + userId);
    navigate("/profile", { state: { userId } });
  };

  const handleDislike = () => {
    setDislikeStatus(!dislikeStatus);
    const newDislikes = dislikeStatus ? dislikes - 1 : dislikes + 1;
    setDislikes(newDislikes);
    let newLikes = likes;
    let newLaughs = laughs;
    if (likeStatus) {
      newLikes = likes - 1;
      setLikes(newLikes);
      setLikeStatus(false);
    }
    if (laughStatus) {
      newLaughs = laughs - 1;
      setLaughs(newLaughs);
      setLaughStatus(false);
    }
    const reactions = {
      likes: newLikes,
      dislikes: newDislikes,
      laughs: newLaughs,
      reposts: reposts,
    }
    try {
      axios.put(`http://localhost:5001/post/${post._id}`, { reactions });
      axios.get(`http://localhost:5001/user/${post.owner}`).then(res => {
        const data = res.data;
        const notis = data.notifications;
        notis.push(`${loggedInData.realname} disliked your post: ${post.title}`);
        const newData = {
          ...data,
          notis
        }
        axios.put(`http://localhost:5001/user/${post.owner}`, newData);
      }).catch(err => console.log(err));
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleLaugh = () => {
    setLaughStatus(!laughStatus);
    const newLaughs = laughStatus ? laughs - 1 : laughs + 1;
    setLaughs(newLaughs);
    let newLikes = likes;
    let newDislikes = dislikes;
    if (likeStatus) {
      newLikes = likes - 1;
      setLikes(newLikes);
      setLikeStatus(false);
    }
    if (dislikeStatus) {
      newDislikes = dislikes - 1;
      setDislikes(newDislikes);
      setDislikeStatus(false);
    }
    const reactions = {
      likes: newLikes,
      dislikes: newDislikes,
      laughs: newLaughs,
      reposts: reposts,
    }
    try {
      axios.put(`http://localhost:5001/post/${post._id}`, { reactions });
      axios.get(`http://localhost:5001/user/${post.owner}`).then(res => {
        const data = res.data;
        const notis = data.notifications;
        notis.push(`${loggedInData.realname} laughed at post: ${post.title}`);
        const newData = {
          ...data,
          notis
        }
        axios.put(`http://localhost:5001/user/${post.owner}`, newData);
      }).catch(err => console.log(err));
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleRepost = () => {
    setRepostStatus(!repostStatus);
    const newReposts = repostStatus ? reposts - 1 : reposts + 1;
    setReposts(newReposts);

    const reactions = {
      likes: likes,
      dislikes: dislikes,
      laughs: laughs,
      reposts: newReposts,
    }
    try {
      axios.put(`http://localhost:5001/post/${post._id}`, { reactions });
    } catch (err) {
      console.log(err.message);
    }
    if (!repostStatus) {
      const repost = {
        owner: localStorage.getItem("userId"),
        title: post.title,
        description: post.description,
        media: post.media,
        tags: post.tags,
        archived: post.archived,
        news: post.news,
        date: post.date,
        repost: true,
        hiddenBy: post.hiddenBy,
        originalCreator: post.owner,
      };
      console.log(repostStatus)
      try {
        axios.post(`http://localhost:5001/post`, repost);
        axios.get(`http://localhost:5001/user/${post.owner}`).then(res => {
          const data = res.data;
          const notis = data.notifications;
          notis.push(`${loggedInData.realname} reposted your post: ${post.title}`);
          const newData = {
            ...data,
            notis
          }
          axios.put(`http://localhost:5001/user/${post.owner}`, newData);
        }).catch(err => console.log(err));
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleHide = () => {
    const newHiddenBy = [...hiddenBy, loggedInId];
    setHiddenBy(newHiddenBy);
    axios.put(`http://localhost:5001/post/${post._id}`, { hiddenBy: newHiddenBy });
    window.location.reload();
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const owner = localStorage.getItem("userId");
    if (commentInput.trim()) {
      // Send comment to the backend
      try {
        axios.get(`http://localhost:5001/user/${owner}`).then((res) => {
          const commentOwner = res.data.realname;
          const newComment = {
            text: commentInput.trim(),
            owner: commentOwner,
          };
          axios.post(
            `http://localhost:5001/post/${post._id}/comment`,
            newComment
          );
          setComments([...comments, newComment]);
        });
        axios.get(`http://localhost:5001/user/${post.owner}`).then(res => {
          const data = res.data;
          const notis = data.notifications;
          notis.push(`New Comment by ${loggedInData.realname} on post: ${post.title}`);
          const newData = {
            ...data,
            notis
          }
          axios.put(`http://localhost:5001/user/${post.owner}`, newData);
        }).catch(err => console.log(err));
      } catch (err) {
        console.log(err.message);
      }

      setCommentInput("");
    }
  };


  useEffect(() => {
    // if post.media is null do not do anyting
    if (!post.media) {
      return;
    }
    const picRef = ref(storage, "post/" + post.media);
    getDownloadURL(picRef)
      .then((url) => {
        setMedia(url);
      })
      .catch((err) => {
        console.log(err);
      });
    const comments = post.comments;
    setComments(comments);

    axios.get(`http://localhost:5001/user/${post.owner}`).then((res) => {
      // console.log(res.data);
      setUsername(res.data.realname);
      setUserId(res.data.uid);
      if (res.data.profilePic !== "No file chosen") {
        const profilePicRef = ref(storage, "user/" + res.data.profilePic);
        // console.log(profilePicRef);
        getDownloadURL(profilePicRef)
          .then((url) => {
            setUserProfilePic(url);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }).catch(err => {
      console.log(err);
    });
    if (post.repost) {
      axios.get(`http://localhost:5001/user/${post.originalCreator}`).then((res) => {
        setOriginalCreator(res.data.realname);
      }).catch(err => {
        console.log(err);
      });
    }
  }, []);

  return (
    <div>
      {(userData.blockedUsers.includes(loggedInId) || loggedInData.blockedUsers.includes(userId) || post.hiddenBy.includes(loggedInId)) ? (
        <><div></div></>
      ) : (<>
        <div className="post-card">
          <div className="user-info-container">
            <img
              onClick={() => { profileClicked(userId) }}
              src={userProfilePic}
              alt="User profile"
              style={{ width: "50px", height: "50px" }}
              className="user-profile-pic"
            />
            <span className="username">{username}
              {post.repost && (
                <span className="repost">Reposted from {originalCreator}</span>
              )}
            </span>
            <button className="options-button ml-auto" id="optionsButt" onClick={(event) => openModal(event)}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              style={modalStyles}
            >
              <div className="modal-container">
                <div className="w-full bg-gray-100 overflow-y-scroll" style={{ height: '200px', borderRadius: '5px' }}>
                  <div className="flex items-center h-1/3 border-b border-gray-300 p-2">
                    {/*  actions for each profile card */}
                    <div className="ml-4">
                      {/*Add more information or actions here */}
                      <button
                        className="text-gray-800 font-semibold"
                        onClick={handleHide}
                      >Hide Post</button>
                    </div>
                  </div>
                  <div className="flex items-center h-1/3 border-b border-gray-300 p-2">
                    {/*  actions for each profile card */}
                    <div className="ml-4">
                      {/* Add more information or actions here */}
                      <button
                        className="text-gray-800 font-semibold"
                      >Block User</button>
                    </div>
                  </div>
                  <div className="flex items-center h-1/3 border-gray-300 p-2">
                    {/*  actions for each profile card */}
                    <div className="ml-4">
                      {/* Add more information or actions here */}
                      <button
                        className="text-gray-800 font-semibold"
                      >Message User</button>
                    </div>
                  </div>
                </div>

              </div>
            </Modal>
          </div>
          <div className="post-header">
            <h2 className="font-bold">{post.title}</h2>
            <p>{post.description}</p>
          </div>
          {mediaType === "image" && media !== "" && (
            <img src={media} alt="Post media" className="post-image center-media" />
          )}
          {mediaType === "video" && media !== "" && (
            <video controls className="post-video center-media">
              <source src={media} />
            </video>
          )}
          {mediaType === "audio" && media !== "" && (
            <audio controls className="post-audio center-media">
              <source src={media} type={`audio/${mediaExtension}`} />
            </audio>
          )}

          <div>&nbsp;</div>

          <div className="post-tags">Tags: {post.tags.join(" ")}</div>

          <div className="post-interactions">
            <button
              className={`post-button ${likeStatus ? "active" : ""}`}
              onClick={handleLike}
            >
              Like ({likes})
            </button>
            <button
              className={`post-button ${dislikeStatus ? "active" : ""}`}
              onClick={handleDislike}
            >
              Dislike ({dislikes})
            </button>
            <button
              className={`post-button ${laughStatus ? "active" : ""}`}
              onClick={handleLaugh}
            >
              Laugh ({laughs})
            </button>
            <button
              className={`post-button ${repostStatus ? "active" : ""}`}
              onClick={handleRepost}
            >
              Repost ({reposts})
            </button>
          </div>
          <div className="post-comments">
            {comments.map(({ text, owner }, index) => {
              return (
                <div key={index} className="comment">
                  {owner} : {text}
                </div>
              );
            })}
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                className="comment-input"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
              />
              <button type="submit" className="submit-button">
                Comment
              </button>
            </form>
          </div>
        </div>
      </>)
      }</div>
  );
};
export default Post;
