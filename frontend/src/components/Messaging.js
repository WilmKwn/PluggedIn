import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import axios from "axios";
import { auth } from "./firebase";
import { storage, ref, getDownloadURL } from './firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

//import {useState, useEffect} from 'react';

const Messaging = ({ title }) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    realname: "",
    friends: [],
  });
  const [messageText, setMessageText] = useState("");
  const [friendObjArr, setFriendObjArr] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currFriendObj, setCurrFriendObj] = useState({
    uid: "",
    realname: "",
  });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get(`http://localhost:5001/user/${userId}`)
      .then((res) => {
        // Process the user data here if the response was successful (status 200)
        console.log(`http://localhost:5001/user/${userId}`);
        console.log(res.data);
        setUserData(res.data); // Update state with user data
        res.data.friends.forEach(friendId => {
          axios.get(`http://localhost:5001/user/${friendId}`)
            .then((friendRes) => {
              console.log("inner");
              console.log(friendRes.data);
              const { uid, profilePic, realname } = friendRes.data;
              const picRef = ref(storage, "user/" + profilePic);
              getDownloadURL(picRef).then((url) => {
                setFriendObjArr(prevArr => [...prevArr, { uid, profilePic, realname, url }]);
                console.log(url)
                //setpfpArr(pArr => [...pArr, url]);                  
              }).catch(error => {
                console.error("Error getting pfp url:", error);
              });

            })
            .catch((error) => {
              console.error("Error fetching friend data:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // Handle any errors that occur during the fetch request
      });


  }, [userId]);
  //const currFriendId = friendObjArr[0] ? friendObjArr[0].uid : "None";

  const profileImages = ["/PFP1.jpg", "/PFP2.jpg", "/PFP3.jpg", "/PFP4.jpg", "/PFP1.jpg", "/PFP2.jpg", "/PFP3.jpg", "/PFP4.jpg"];
  const connectionNames = [];

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const findConversation = () => {
    const user1id = userId < currFriendObj.uid ? userId : currFriendObj.uid;
    const user2id = userId > currFriendObj.uid ? userId : currFriendObj.uid;
    //console.log(user1id)
    //console.log(user2id)
    const conversation = conversations.find((conv) => (
      (conv.user1id === user1id && conv.user2id === user2id) ||
      (conv.user2id === user1id && conv.user1id === user2id)
    ));
    //console.log("get convo");
    //console.log(conversation);
    return conversation;
  };
  useEffect(() => {
    axios.get("http://localhost:5001/conversation")
      .then((res) => {
        console.log("set convos");
        console.log(res)
        setConversations(res.data);
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  }, [currFriendObj]);

  const selectedConversation = findConversation();
  const handleSendMessage = () => {
    console.log(messageText);
    if (messageText.trim() !== "" && currFriendObj.uid !== "") {
      // Check if the message is not empty
      const newMessage = {
        user1id: localStorage.getItem("userId"),
        user2id: currFriendObj.uid,
        content: messageText,
        //timestamp: new Date().toISOString(),
      };

      // Make an API call to add the new message to the selected conversation
      axios.post(`http://localhost:5001/conversation/message`, newMessage)
        .then((response) => {
          console.log("Message sent successfully:", response.data);
          // Optionally, update the UI or clear the input field after sending the message
          setMessageText("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
    setCurrFriendObj({ uid: currFriendObj.uid, realname: currFriendObj.realname });
    findConversation();
  };
  const modalStyles = {
    content: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 'auto',
      top: 'auto',
      marginRight: '10px',
      marginBottom: '10px',
      border: 'none',
      background: 'white',
      overflow: 'hidden',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '5px',
      outline: 'none',
      padding: '20px',
      minWidth: '800px',
      height: '600px'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  };

  return (
    <div>
      <button onClick={openModal} className="button">
        Messages <FontAwesomeIcon icon={faMessage} />
      </button>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Messages"
        style={modalStyles}
      >
        <div className="modal-container">
          <header className="flex">
            <div className="messaging-banner flex justify-between items-center">
              <h2 className="text-2xl p-5 text-white font-bold mb-4">{title}</h2>
              <button onClick={closeModal} className="button m-5">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </header>
          <div className="text-center">
            {/* Other content in the center if any */}
          </div>
          <div className="flex-1 flex flex-col overflow-y-hidden">
            <div className="flex">
              {/* Sidebar with profile images */}
              <div className="w-1/4 p-4 bg-gray-100 overflow-y-scroll" style={{ marginBottom: '5px', height: '400px', borderRadius: '5px' }}>
                {(friendObjArr).map((friend, index) => (
                  <div key={index} className="flex items-center border-b border-gray-300 p-2">
                    <div>
                      <img
                        src={friend.url}
                        alt={`Profile ${index + 1}`}
                        className="w-12 h-12 rounded-full cursor-pointer"
                        onClick={() => setCurrFriendObj({ uid: friend.uid, realname: friend.realname })} /*console.log(`Clicked on profile ${friend.uid + 1}`)*/
                      />
                    </div>
                    {/*  actions for each profile card */}
                    <div className="ml-4">
                      <p className="text-gray-800 font-semibold">{friend.realname}</p>
                      {/* Add more information or actions here */}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-200 overflow-y-scroll" style={{ marginBottom: '5px', width: '600px', maxHeight: '400px', borderRadius: '5px' }}>
                {currFriendObj.realname === "" ? (
                  <p>Select a user to view your conversation!</p>
                ) : (
                  <p>
                    {selectedConversation
                      ? (
                        <>  
                          <p>You have a conversation with {currFriendObj.realname}.</p>
                          {/* Display all messages in the selected conversation */}
                          {selectedConversation.messages.map((message, index) => (
                            <div key={index} className={`mb-2 ${message.senderUid === userId ? ' text-sm ml-auto bg-gray-300' : ' text-sm bg-blue-500 text-white'} p-2 rounded-md`} style={{ maxWidth: '75%' }}>
            <p className="font-semibold">{message.senderUid === userId ? 'You' : currFriendObj.realname}:</p>
            <p>{message.content}</p>
            <p className="text-gray-500 text-xs mt-1">{new Date(message.sent).toLocaleString()}</p>
          </div>
                          ))}
                        </>
                      )
                      : `Send a message to start a new conversation with ${currFriendObj.realname}!`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <input type="text"
                placeholder="Type your message..."
                className="w-full p-3 ml-1 mb-1 border border-gray-300 rounded-l-md"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)} />
              <button onClick={handleSendMessage} className="button rounded-r-md ml-2 mb-1">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Messaging;
