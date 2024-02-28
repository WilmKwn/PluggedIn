import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import axios from "axios";
import { auth } from "./firebase";
import {storage, ref, getDownloadURL} from './firebase';

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
  const [friendObjArr, setFriendObjArr] = useState([]);
  const [pfpArr, setpfpArr] = useState([]);
  const userId = auth.currentUser.uid;
  //const friendObjArr = [];
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
                  const {uid, profilePic, realname} = friendRes.data;
                  const picRef = ref(storage, "user/"+profilePic);
                  getDownloadURL(picRef).then((url) => {
                    setFriendObjArr(prevArr=> [...prevArr, { uid, profilePic, realname, url}]);
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
  }, []); 


  const profileImages = ["/PFP1.jpg", "/PFP2.jpg", "/PFP3.jpg", "/PFP4.jpg", "/PFP1.jpg", "/PFP2.jpg", "/PFP3.jpg", "/PFP4.jpg"];
  const connectionNames = [];
  const templateMessages = [
    { sender: 'User 1', message: 'Hey, how\'s it going?' },
    { sender: 'You', message: 'Not bad! What about you?' },
    { sender: 'User 1', message: 'What\'s your favorite genre?' },
    { sender: 'You', message: 'Black banjocore fasho!' },
    { sender: 'User 1', message: 'No way, I\'m a huge fan' },
    { sender: 'You', message: 'Right? The modern instrumentation combined with the classic banjo sound provide a wholly original experiece.' },
    { sender: 'User 1', message: 'Exactly. Who doesn\'t like some nice twanging every now and then?' },
  ];
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  
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
                        onClick={() => console.log(`Clicked on profile ${friend.uid + 1}`)}
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
              <div className="p-4 bg-gray-200 overflow-y-scroll" style={{ marginBottom: '5px', maxWidth: '600px', maxHeight: '400px', borderRadius: '5px' }}>
                {templateMessages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.sender === 'You' ? ' text-sm ml-auto bg-gray-300' : ' text-sm bg-blue-500 text-white'} p-2 rounded-md`} style={{ maxWidth: '75%'}}>
                    <p className="font-semibold">{message.sender}:</p>
                    <p>{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <input type="text" placeholder="Type your message..." className="w-full p-3 ml-1 mb-1 border border-gray-300 rounded-l-md" />
              <button className="button rounded-r-md ml-2 mb-1">
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
