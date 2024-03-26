import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from 'react-modal';

import "../App.css";
import axios from "axios";
import { storage, ref, getDownloadURL, auth } from "./firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const Song = ({ songParam }) => {
  const [song] = useState(songParam);
  const navigate = useNavigate();
  // Dummy user details
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();

  const [userProfilePic, setUserProfilePic] = useState(
    "https://via.placeholder.com/150"
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const openModal = (event) => {
    const oButt = event.currentTarget;
    const oButtRect = oButt.getBoundingClientRect();
    const modalTop = oButtRect.bottom;
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

  const [media, setMedia] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [mediaExtension, setMediaExtension] = useState("");

  useEffect(() => {
    if (song.media) {
      const extension = song.media.split(".").pop().toLowerCase();
      setMediaExtension(extension);
      if (["mp4", "webm", "ogg", "mp3", "wav"].includes(extension)) {
        setMediaType("video");
      } else {
        setMediaType("image");
      }
      const picRef = ref(storage, "post/" + song.media);
      getDownloadURL(picRef)
        .then((url) => {
          setMedia(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [song]);

  const profileClicked = (id) => {
    const userId = id;
    console.log("navigate to " + userId);
    navigate("/profile", { state: { userId } });
  };

  useEffect(() => {
    //console.log(post.media);
    const picRef = ref(storage, "post/" + song.media);
    getDownloadURL(picRef)
      .then((url) => {
        setMedia(url);
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(`http://localhost:5001/user/${song.owner}`).then((res) => {
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
    });
  }, []);

  return (
    <div className="post-card">
      <div className="user-info-container">
        <img
          onClick={() => { profileClicked(userId) }}
          src={userProfilePic}
          alt="User profile"
          style={{ width: "50px", height: "50px" }}
          className="user-profile-pic"
        />
        <span className="username">{username}</span>
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
                  <p className="text-gray-800 font-semibold">Button 1</p>
                  {/* Add more information or actions here */}
                </div>
              </div>
              <div className="flex items-center h-1/3 border-b border-gray-300 p-2">
                {/*  actions for each profile card */}
                <div className="ml-4">
                  <p className="text-gray-800 font-semibold">Button 2</p>
                  {/* Add more information or actions here */}
                </div>
              </div>
              <div className="flex items-center h-1/3 border-gray-300 p-2">
                {/*  actions for each profile card */}
                <div className="ml-4">
                  <p className="text-gray-800 font-semibold">Button 3</p>
                  {/* Add more information or actions here */}
                </div>
              </div>
            </div>

          </div>
        </Modal>
      </div>
      <div className="post-header">
        <h2 className="font-bold">{song.title}</h2>
        <p>{song.isTag ? "Producer Tag" : "Song"}</p>
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
    </div>
  );
};

export default Song;