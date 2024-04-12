import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { storage, ref, getDownloadURL, auth } from "./firebase";

const MicroPost = ({ postParam }) => {
  const [post] = useState(postParam);

  // Dummy user details
  const [username, setUsername] = useState();
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
    const owner = auth.currentUser.uid;
    if (commentInput.trim()) {
      // Send comment to the backend
      try {
        axios.get(`http://localhost:5001/user/${owner}`)
          .then((res) => {
            const commentOwner = res.data.realname;
            const newComment = {
              text: commentInput.trim(),
              owner: commentOwner,
            }
            axios.post(`http://localhost:5001/post/${post._id}/comment`, newComment);
            setComments([...comments, newComment]);
          })
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

    axios.get(`http://localhost:5001/user/${post.owner}`)
      .then((res) => {
        // console.log(res.data);
        setUsername(res.data.realname);
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
      })
  }, []);

  return (
    <div className="post-card">
      <div className="user-info-container">
        <img
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
      {mediaType === "image" && media!=='' && (
        <img src={media} alt="Post media" className="post-image w-1/2" />
      )}
      {mediaType === "video" && media!=='' && (
        <video controls className="post-video w-1/2">
          <source src={media} />
        </video>
      )}

      {mediaType === "audio" && media!=='' && (
        <audio controls className="post-audio w-1/2">
          <source src={media} type={`audio/${mediaExtension}`} />
        </audio>
      )}
      <div className="post-tags">Tags: {post.tags}</div>
    </div>
  );
};
export default MicroPost;
