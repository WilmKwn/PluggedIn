import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../App.css";
import axios from "axios";
import { storage, ref, getDownloadURL, auth } from "./firebase";

const Post = ({ postParam }) => {
  const [post] = useState(postParam);
  const navigate = useNavigate();
  // Dummy user details
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();

  const [userProfilePic, setUserProfilePic] = useState(
    "https://via.placeholder.com/150"
  );


  const [likeStatus, setLikeStatus] = useState(false);
  const [dislikeStatus, setDislikeStatus] = useState(false);
  const [laughStatus, setLaughStatus] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [laughs, setLaughs] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [media, setMedia] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [mediaExtension, setMediaExtension] = useState("");

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
  }, [post.media, post.comments]);

  const handleLike = () => {
    setLikeStatus(!likeStatus);
    setLikes(likeStatus ? likes - 1 : likes + 1);
    if (dislikeStatus) {
      setDislikes(dislikes - 1);
      setDislikeStatus(false);
    }
    if (laughStatus) {
      setLaughs(laughs - 1);
      setLaughStatus(false);
    }
  };
  const profileClicked = (id) => {
    const userId = id;
    console.log("navigate to " + userId);
    navigate("/profile", {state: {userId}});
  };
  const handleDislike = () => {
    setDislikeStatus(!dislikeStatus);
    setDislikes(dislikeStatus ? dislikes - 1 : dislikes + 1);
    if (likeStatus) {
      setLikes(likes - 1);
      setLikeStatus(false);
    }
    if (laughStatus) {
      setLaughs(laughs - 1);
      setLaughStatus(false);
    }
  };

  const handleLaugh = () => {
    setLaughStatus(!laughStatus);
    setLaughs(laughStatus ? laughs - 1 : laughs + 1);
    if (likeStatus) {
      setLikes(likes - 1);
      setLikeStatus(false);
    }
    if (dislikeStatus) {
      setDislikes(dislikes - 1);
      setDislikeStatus(false);
    }
  };

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
      } catch (err) {
        console.log(err.message);
      }

      setCommentInput("");
    }
  };

  useEffect(() => {
    //console.log(post.media);
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
      console.log(res.data);
      setUsername(res.data.realname);
      setUserId(res.data.uid);
      if (res.data.profilePic !== "No file chosen") {
        const profilePicRef = ref(storage, "user/" + res.data.profilePic);
        console.log(profilePicRef);
        getDownloadURL(profilePicRef)
          .then((url) => {
            setUserProfilePic(url);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }, []);

  return (
    <div className="post-card">
      <div className="user-info-container">
        <img
          onClick={()=>{profileClicked(userId)}}
          src={userProfilePic}
          alt="User profile"
          style={{ width: "50px", height: "50px" }}
          className="user-profile-pic"
        />
        <span className="username">{username}</span>
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
  );
};
export default Post;
