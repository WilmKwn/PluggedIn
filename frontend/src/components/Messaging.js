import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import axios from "axios";
import { storage, ref, getDownloadURL } from './firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Messaging = ({ title }) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [myName, setMyName] = useState("");
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
        setMyName(res.data.realname);
        res.data.friends.forEach(friendId => {
          axios.get(`http://localhost:5001/user/${friendId}`)
            .then((friendRes) => {
              const { uid, profilePic, realname } = friendRes.data;
              const picRef = ref(storage, "user/" + profilePic);
              getDownloadURL(picRef).then((url) => {
                setFriendObjArr(prevArr => [...prevArr, { uid, profilePic, realname, url }]);
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
      });
  }, [userId]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const [gifModalOpen, setGifModalOpen] = useState(false);
  const findConversation = () => {
    const user1id = userId < currFriendObj.uid ? userId : currFriendObj.uid;
    const user2id = userId > currFriendObj.uid ? userId : currFriendObj.uid;
    const conversation = conversations.find((conv) => (
      (conv.user1id === user1id && conv.user2id === user2id) ||
      (conv.user2id === user1id && conv.user1id === user2id)
    ));
    return conversation;
  };

  const fetchConversation = () => {
    axios.get("http://localhost:5001/conversation")
      .then((res) => {
        setConversations(res.data);
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8181');
    ws.onmessage = (event) => {
      fetchConversation();
      // const obj = JSON.parse(event.data).updateDescription.updatedFields;
      // const num = obj.__v;
      // const sender = obj[`messages.${num-1}`].senderUid;
      // if (sender !== userId) {
      //   axios.get(`http://localhost:5001/user/${sender}`).then((res) => {
      //     const d = res.data;

      //     //toast.info(`New message from ${d.realname}`);
      //   });
      // }
    };
    fetchConversation();
  }, []);

  const selectedConversation = findConversation();
  const handleSendMessage = () => {
    if (messageText.trim() !== "" && currFriendObj.uid !== "") {
      // Check if the message is not empty
      const newMessage = {
        user1id: localStorage.getItem("userId"),
        user2id: currFriendObj.uid,
        content: messageText,
        //timestamp: new Date().toISOString(),
      };

      axios.post(`http://localhost:5001/conversation/message`, newMessage)
      .then((response) => {
        setMessageText("");
        
        // update notifications of the recipient
        axios.get(`http://localhost:5001/user/${currFriendObj.uid}`).then(res => {
          const data = res.data;
          const notis = data.notifications;
          notis.push(`New Message from ${myName}`);
          const newData = {
            ...data,
            notis
          }
          axios.put(`http://localhost:5001/user/${currFriendObj.uid}`, newData);
        });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
    }
    setCurrFriendObj({ uid: currFriendObj.uid, realname: currFriendObj.realname });
    findConversation();
  };
  //AIzaSyDQ5G0U8_26WdvFn-_l5EAQ9BDcATMiKEs 
  const handleGif = () => {
    grab_data();
    setGifModalOpen(true);
  }
  const closeGifModal = () => {
    // Close the GIF modal
    setGifModalOpen(false);
  };
  function httpGetAsync(theUrl, callback)
{
    // create the request object
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);

    return;
}
function tenorCallback_share(responsetext)
{
    // no action is needed in the share callback
}
// callback for the top 8 GIFs of search
function tenorCallback_search(responsetext)
{
    // Parse the JSON response
    var response_objects = JSON.parse(responsetext);

    var top_10_gifs = response_objects["results"];

    // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (gif)

    document.getElementById("preview_gif").src = top_10_gifs[0]["media_formats"]["nanogif"]["url"];

    document.getElementById("share_gif").src = top_10_gifs[0]["media_formats"]["gif"]["url"];

    return;

}


// function to call the trending and category endpoints
function grab_data()
{
    // set the apikey and limit
    var apikey = "AIzaSyDQ5G0U8_26WdvFn-_l5EAQ9BDcATMiKEs";
    var clientkey = "my_test_app";
    var lmt = 8;

    // test search term
    var search_term = messageText;

    // using default locale of en_US
    var search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
            apikey +"&client_key=" + clientkey +  "&limit=" + lmt;

    httpGetAsync(search_url,tenorCallback_search);

    // data will be loaded by each call's callback
    return;
}

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
                          {/*selectedConversation.messages.map((message, index) => (
                            <div key={index} className={`mb-2 ${message.senderUid === userId ? ' text-sm ml-auto bg-gray-300' : ' text-sm bg-blue-500 text-white'} p-2 rounded-md`} style={{ maxWidth: '75%' }}>
                              <p className="font-semibold">{message.senderUid === userId ? 'You' : currFriendObj.realname}:</p>
                              <p>{message.content}</p>
                              <p className="text-gray-500 text-xs mt-1">{new Date(message.sent).toLocaleString()}</p>
                            </div>
                          ))*/}
                          {selectedConversation.messages.map((message, index) => {
  // Regular expression to match Tenor GIF URLs
  const tenorGifRegex = /^https?:\/\/tenor\.com\/view\/.*$/i;

  // Check if the message content contains a Tenor GIF URL
  const containsTenorGif = tenorGifRegex.test(message.content);
  console.log(containsTenorGif);
  return (
    <div key={index} className={`mb-2 ${message.senderUid === userId ? ' text-sm ml-auto bg-gray-300' : ' text-sm bg-blue-500 text-white'} p-2 rounded-md`} style={{ maxWidth: '75%' }}>
      <p className="font-semibold">{message.senderUid === userId ? 'You' : currFriendObj.realname}:</p>
      {/* Check if the message contains a Tenor GIF */}
      {containsTenorGif ? (
        // If a Tenor GIF is present, embed it
        <img src="https://tenor.com/view/my-wife-manhog-manhogging-man-hog-gif-25996833" alt="Tenor GIF" />
      ) : (
        // If no Tenor GIF is present, display the message content
        <p>{message.content}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">{new Date(message.sent).toLocaleString()}</p>
    </div>
  );
})}

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
              <button onClick={handleGif} className="button rounded-r-md ml-2 mb-1">
                gif
              </button>
              {gifModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
          <h2># 1 GIF loaded - preview image</h2>
<img id="preview_gif" src="" alt=""></img>

<h2># 1 GIF loaded - share image</h2>
<img id="share_gif" src="" alt=""></img>

            <button onClick={closeGifModal} className="button mt-4">
              Close
            </button>
          </div>
        </div>
      )}


            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Messaging;
