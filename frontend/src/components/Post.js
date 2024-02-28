import React, { useEffect, useState } from "react";
import "../App.css";

import {storage, ref, getDownloadURL} from './firebase';

const Post = ({postParam}) => {
  const [post] = useState(postParam);

  const [likeStatus, setLikeStatus] = useState(false);
  const [dislikeStatus, setDislikeStatus] = useState(false);
  const [laughStatus, setLaughStatus] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [laughs, setLaughs] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [media, setMedia] = useState("");

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
    if (commentInput.trim()) {
      setComments([...comments, commentInput.trim()]);
      setCommentInput("");
    }
  };

  useEffect(() => {
    const picRef = ref(storage, "user/"+post.media);
    getDownloadURL(picRef).then((url) => {
      setMedia(url);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  return (
    <div className="post-card">
      <div className="post-header">
        <h2 className="font-bold">{post.title}</h2>
        <p>{post.description}</p>
      </div>
      {post.media && (
        <img src={media} alt="Post media" className="post-image w-1/2" />
      )}
      {post.tags && <p className="post-tags">Tags: {post.tags.join(", ")}</p>}
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
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            You: {comment}
          </div>
        ))}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            className="comment-input"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit" className="cta-button">
            Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
