import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { storage, ref, getDownloadURL } from "./firebase";

const ShareModal = ({ isOpen, onRequestClose, userId }) => {
  const [friends, setFriends] = useState([]);
  const modalStyles = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "1px solid #ccc",
      background: "#fff",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "4px",
      outline: "none",
      padding: "20px",
    },
  };

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined. Cannot fetch friends.");
      return;
    }

    axios
      .get(`http://localhost:5001/user/${userId}`)
      .then((response) => {
        const friendsData = response.data.friends || [];
        return Promise.all(
          friendsData.map((friendId) =>
            axios
              .get(`http://localhost:5001/user/${friendId}`)
              .then((friendRes) => {
                const { uid, realname } = friendRes.data;
                const picRef = ref(
                  storage,
                  "user/" + friendRes.data.profilePic
                );
                return getDownloadURL(picRef)
                  .then((url) => {
                    return { uid, realname, url };
                  })
                  .catch(() => ({
                    uid,
                    realname,
                    url: "https://via.placeholder.com/150",
                  }));
              })
          )
        );
      })
      .then((friends) => {
        setFriends(friends);
      })
      .catch((error) => console.error("Error fetching friends:", error));
  }, [userId]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Share Post Modal"
    >
      <h2>Share this Post</h2>
      <div>
        {friends.map((friend, index) => (
          <div
            key={index}
            className="flex items-center border-b border-gray-300 p-2"
          >
            <div>
              <img
                src={friend.url}
                alt={`Profile ${index + 1}`}
                className="w-12 h-12 rounded-full cursor-pointer"
                onClick={() => alert(`Post shared with ${friend.realname}!`)}
              />
            </div>
            <div className="ml-4">
              <p className="text-gray-800 font-semibold">{friend.realname}</p>
              <button
                onClick={() => alert(`Post shared with ${friend.realname}!`)}
              >
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ShareModal;
