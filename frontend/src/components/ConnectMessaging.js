import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { storage, ref, getDownloadURL } from "./firebase";import useSpeechToText from "./hooks/useSpeechToText"; // Make sure to import your hook

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faTimes,
  faPaperPlane,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

const ConnectMessaging = ({inId}) => {
    const [isConnectNoteModalOpen, setisConnectNoteModalOpen] = useState(false);
  const openNoteModal = () => setisConnectNoteModalOpen(true);
  const closeNoteModal = () => setisConnectNoteModalOpen(false);
  const [messageText, setMessageText] = useState("");
const pageId = inId;
  const userId = localStorage.getItem("userId");
  const loggedInId = localStorage.getItem(
    "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
  );
  const handleSendMessageWithConnection = () => {
    if (messageText.trim() !== "" && userId !== "") {
      // Check if the message is not empty
      const newMessage = {
        user1id: loggedInId,
        user2id: userId,
        content: messageText,
        //timestamp: new Date().toISOString(),
      };

      axios
        .post(`http://localhost:5001/conversation/message`, newMessage)
        .then((response) => {
          setMessageText("");

          // update notifications of the recipient
          axios
            .get(`http://localhost:5001/user/${userId}`)
            .then((res) => {
              const data = res.data;
              const notis = data.notifications;
              notis.push(`New Message from ${loggedInId}`);
              const newData = {
                ...data,
                notis,
              };
              axios.put(
                `http://localhost:5001/user/${userId}`,
                newData
              );
            });
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
    
  };
    const handleConnect = () => {
        console.log("connect");
        console.log(pageId);
        console.log(
          localStorage.getItem("actualUserIdBecauseWilliamYongUkKwonIsAnnoying")
        );
        axios
          .post(
            `http://localhost:5001/user/${localStorage.getItem(
              "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
            )}/friends`,
            { friend: pageId }
          )
          .then((response) => {
            console.log("Friend added successfully:", response.data);
            // Optionally, update the UI or handle success
          })
          .catch((error) => {
            console.error("Error adding friend:", error);
            // Optionally, handle the error or revert local state changes
          });
          if (messageText) {
            handleSendMessageWithConnection();  
          }
      };
      const handleInputChange = (e) => {
        e.stopPropagation(); // Prevent the click event from propagating
        setMessageText(e.target.value); // Update the messageText state
      };
      const modalStytles = {
        content: {
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          marginRight: "10px",
          marginBottom: "10px",
          border: "none",
          background: "white",
          overflow: "hidden",
          WebkitOverflowScrolling: "touch",
          borderRadius: "5px",
          outline: "none",
          padding: "0px",
          minWidth: "300px",
          height: "200px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
      }
      return (
        <div>
                    <button onClick={openNoteModal}
                      className="button"
                    >
                      {/*console.log(userData.friends)*/}
                      Connect </button>
                    <Modal
                      isOpen={isConnectNoteModalOpen}
                      onRequestClose={closeNoteModal}
                      shouldReturnFocusAfterClose={true}
                      shouldCloseOnOverlayClick={true}
                      shouldCloseOnEsc={false}
                      style={modalStytles}
                    >
                      <div className="modal-container">
                        <div><header className="flex">
                          <div className="messaging-banner flex justify-between items-center">
                            <h1 className="text-1xl p-5 font-bold text-white mb-4">
                              You can send a message with your connection!
                            </h1>
                            <button onClick={closeNoteModal} className="button m-5">
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </header>
                        <div className="flex items-center mt-4">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="w-full p-3 ml-1 mb-1 border border-gray-300 rounded-l-md"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)/*handleInputChange*/}
                          />
                          <button onClick={() => handleConnect()}
                            className="button"
                          >
                            {/*console.log(userData.friends)*/}
                            Connect</button>
                        </div>
                        </div>
                      </div>
                    </Modal>
                  </div>
      );
};

export default ConnectMessaging;