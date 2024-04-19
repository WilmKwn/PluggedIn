import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storage, ref, getDownloadURL } from "./firebase";

const CompactPost = ({ postParam }) => {
  const [post] = useState(postParam);
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();
  const [media, setMedia] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [mediaExtension, setMediaExtension] = useState("");

  useEffect(() => {
    // Fetch user and media data
    axios
      .get(`http://localhost:5001/user/${post.owner}`)
      .then((res) => {
        setUsername(res.data.realname);
        setUserId(res.data.uid);
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, [post]);

  const profileClicked = (id) => {
    navigate("/profile", { state: { userId: id } });
  };

  return (
    <div className="post-card compact">
      <div
        className="user-info-container"
        onClick={() => profileClicked(userId)}
      >
        <span className="username">{username}</span>
      </div>
      <div className="post-content">
        <h2 className="font-bold">{post.title}</h2>
        <p>{post.description}</p>
        {mediaType === "image" && media !== "" && (
          <img
            src={media}
            alt="Post media"
            className="post-image center-media"
          />
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
      </div>
    </div>
  );
};

export default CompactPost;
