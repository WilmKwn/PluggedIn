import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { storage, ref, getDownloadURL } from "./firebase";
import useSpeechToText from "./hooks/useSpeechToText"; // Make sure to import your hook

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faTimes,
  faPaperPlane,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

const Messaging = ({ title }) => {
  const [placeholder, setPlaceholder] = useState("Type your message...");

  const [showReactions, setShowReactions] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [isReply, setIsReply] = useState(false); // Track if the current message is a reply

  const [interactionActive, setInteractionActive] = useState(false); // Track if any interaction is active

  const [isModalOpen, setModalOpen] = useState(false);
  const [myName, setMyName] = useState("");
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [userData, setUserData] = useState({
    realname: "",
    friends: [],
  });
  const [messageText, setMessageText] = useState("");
  const [top_10_gifs, setTop_10_gifs] = useState([]);
  const [friendObjArr, setFriendObjArr] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currFriendObj, setCurrFriendObj] = useState({
    uid: "",
    realname: "",
  });
  const userId = localStorage.getItem("userId");

  // Speech-to-Text state and functions
  const { text, start, stop, listening } = useSpeechToText();

  const handleReply = (message) => {
    console.log("handle reply");
    setIsReply(true);
    setReplyingToMessage(message);
    setMessageText(""); // Clear the message text
    // Update placeholder dynamically based on the message content
    setPlaceholder(`Reply to '${message.content.substring(0, 50)}'`); // Truncate if necessary
    setTimeout(() => {
      const inputElement = document.getElementById("messageInput");
      if (inputElement) inputElement.focus();
      else console.error("messageInput element not found");
    }, 0);
    setInteractionActive(true);
  };

  const handleReact = (message, messageId) => {
    setReplyingToMessage(message);
    setShowReactions((prevState) => !prevState);
    setActiveMessageId(messageId);
    setInteractionActive(true);
  };

  const handleVoiceInput = () => {
    if (listening) {
      stop();
    } else {
      start();
    }
  };
  useEffect(() => {
    // Whenever 'text' changes, update the messageText state
    setMessageText(text);
  }, [text]);

  const handleCancelReply = () => {
    setReplyingToMessage(null);
    setMessageText("");
    setPlaceholder("Type your message..."); // Reset placeholder
    setInteractionActive(false);
  };
  const handleCancelReact = () => {
    setShowReactions(false);
    setReplyingToMessage(null);
    setMessageText("");
    setPlaceholder("Type your message..."); // Reset placeholder
    setInteractionActive(false);
  };

  const handleSendMessage = () => {
    if (messageText.trim() !== "" && currFriendObj.uid !== "") {
      let content = messageText;
      let replyFlag = false; // We'll use a local variable instead
      console.log("replyign to message is" + replyingToMessage);
      if (replyingToMessage) {
        content = `${messageText} (reply to: '${replyingToMessage.content}')`;
        replyFlag = true; // Change the local variable since it is a reply
      }

      console.log("isReply: ", isReply);
      const newMessage = {
        user1id: localStorage.getItem("userId"),
        user2id: currFriendObj.uid,
        content: content,
        isReply: isReply, // Use the local variable here
      };
      axios
        .post(`http://localhost:5001/conversation/message`, newMessage)
        .then((response) => {
          setMessageText("");
          setReplyingToMessage(null);
          setPlaceholder("Type your message..."); // Reset placeholder after sending
          setInteractionActive(false);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
      setIsReply(false); // Now we reset the state for future messages
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5001/user/${userId}`)
      .then((res) => {
        setMyName(res.data.realname);
        res.data.friends.forEach((friendId) => {
          axios
            .get(`http://localhost:5001/user/${friendId}`)
            .then((friendRes) => {
              const { uid, profilePic, realname } = friendRes.data;
              const picRef = ref(storage, "user/" + profilePic);
              for (const friend in friendObjArr) {
                if ((friend.uid = friendId)) {
                  friendObjArr.delete(friend);
                }
              }
              if (friendRes.data.friends.includes(userId)) {
                getDownloadURL(picRef)
                  .then((url) => {
                    setFriendObjArr((prevArr) => [
                      ...prevArr,
                      { uid, profilePic, realname, url },
                    ]);
                  })
                  .catch((error) => {
                    console.error("Error getting pfp url:", error);
                  });
              }
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
    const conversation = conversations.find(
      (conv) =>
        (conv.user1id === user1id && conv.user2id === user2id) ||
        (conv.user2id === user1id && conv.user1id === user2id)
    );
    return conversation;
  };

  const fetchConversation = () => {
    axios
      .get("http://localhost:5001/conversation")
      .then((res) => {
        setConversations(res.data);
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8181");
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

  //AIzaSyDQ5G0U8_26WdvFn-_l5EAQ9BDcATMiKEs
  const handleGif = () => {
    grab_data();
    setGifModalOpen(true);
  };
  const closeGifModal = () => {
    // Close the GIF modal
    setGifModalOpen(false);
  };
  function httpGetAsync(theUrl, callback) {
    // create the request object
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        callback(xmlHttp.responseText);
      }
    };

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);

    return;
  }

  // callback for the top 8 GIFs of search
  function tenorCallback_search(responsetext) {
    // Parse the JSON response
    var response_objects = JSON.parse(responsetext);

    //var top_10_gifs = response_objects["results"];
    setTop_10_gifs(response_objects["results"]);
    // Load all the GIFs
    for (let i = 0; i < top_10_gifs.length; i++) {
      const shareGifUrl = top_10_gifs[i]["media_formats"]["gif"]["url"];

      const shareImg = document.createElement("img");
      shareImg.src = shareGifUrl;
      document.getElementById("share_gifs_container").appendChild(shareImg);
    }
  }

  const handleEmojiClick = (emoji) => {
    console.log(`Reacted with ${emoji} to message ${activeMessageId}`);
    let replyFlag = false;
    if (activeMessageId && replyingToMessage) {
      replyFlag = true; // It's a reply to a message
    }
    handleSendEmojiMessage(emoji); // Pass the flag directly
    setShowReactions(false);
    setReplyingToMessage(null);
    setActiveMessageId(null);
    //setIsReply(false); // Reset the isReply state
    setInteractionActive(false);
  };

  const handleSendEmojiMessage = (emoji) => {
    if (currFriendObj.uid !== "" && replyingToMessage) {
      const originalMessage = replyingToMessage.content;
      const content = `${emoji} (reply to: '${originalMessage.substring(
        0,
        50
      )}')`;
      //setIsReply(true);

      console.log("isReply: ", isReply);

      const newMessage = {
        user1id: localStorage.getItem("userId"),
        user2id: currFriendObj.uid,
        content: content,
        isReply: isReply, // Use the passed parameter to set the isReply field.
      };

      axios
        .post(`http://localhost:5001/conversation/message`, newMessage)
        .then((response) => {
          console.log("Emoji sent as message:", response);
          setMessageText("");
          setReplyingToMessage(null);
          setPlaceholder("Type your message..."); // Reset placeholder after sending
        })
        .catch((error) => {
          console.error("Error sending emoji message:", error);
        });
    }
  };

  // function to call the trending and category endpoints
  function grab_data() {
    // set the apikey and limit
    var apikey = "AIzaSyDQ5G0U8_26WdvFn-_l5EAQ9BDcATMiKEs";
    var clientkey = "my_test_app";
    var lmt = 8;

    // test search term
    var search_term = messageText;

    // using default locale of en_US
    var search_url =
      "https://tenor.googleapis.com/v2/search?q=" +
      search_term +
      "&key=" +
      apikey +
      "&client_key=" +
      clientkey +
      "&limit=" +
      lmt;

    httpGetAsync(search_url, tenorCallback_search);

    // data will be loaded by each call's callback
    return;
  }
  function renderGifs() {
    // Assuming top_10_gifs is an array containing GIF objects
    return top_10_gifs.map((gif, index) => (
      <img
        key={index}
        src={gif.media_formats.gif.url}
        alt={`GIF ${index + 1}`}
        className="cursor-pointer"
        onClick={() => handleGifClick(gif.media_formats.gif.url)}
      />
    ));
  }
  const handleGifClick = (shareGifUrl) => {
    setMessageText(shareGifUrl);
  };

  const modalStyles = {
    content: {
      position: "absolute",
      bottom: "64px",
      right: "0px",
      left: "auto",
      top: "auto",
      marginRight: "10px",
      marginBottom: "10px",
      border: "none",
      background: "white",
      overflow: "hidden",
      WebkitOverflowScrolling: "touch",
      borderRadius: "5px",
      outline: "none",
      padding: "20px",
      minWidth: "800px",
      height: "600px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
  };

  return (
    <div>
      <button onClick={openModal} className="button">
        Messages<div>&nbsp;</div> <FontAwesomeIcon icon={faMessage} />
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Messages"
        style={modalStyles}
      >
        <div className="modal-container">
          <header className="flex">
            <div className="messaging-banner flex justify-between items-center">
              <h2 className="text-2xl p-5 text-white font-bold mb-4">
                {title}
              </h2>
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
              <div
                className="w-1/4 p-4 bg-gray-100 overflow-y-scroll"
                style={{
                  marginBottom: "5px",
                  height: "400px",
                  borderRadius: "5px",
                }}
              >
                {friendObjArr.map((friend, index) => (
                  <div
                    key={index}
                    className="flex items-center border-b border-gray-300 p-2"
                  >
                    <div>
                      <img
                        src={friend.url}
                        alt={`Profile ${index + 1}`}
                        className="w-12 h-12 rounded-full cursor-pointer"
                        onClick={() =>
                          setCurrFriendObj({
                            uid: friend.uid,
                            realname: friend.realname,
                          })
                        } /*console.log(`Clicked on profile ${friend.uid + 1}`)*/
                      />
                    </div>
                    {/*  actions for each profile card */}
                    <div className="ml-4">
                      <p className="text-gray-800 font-semibold">
                        {friend.realname}
                      </p>
                      {/* Add more information or actions here */}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="p-4 bg-gray-200 overflow-y-scroll"
                style={{
                  marginBottom: "5px",
                  width: "600px",
                  maxHeight: "400px",
                  borderRadius: "5px",
                }}
              >
                {currFriendObj.realname === "" ? (
                  <p>Select a user to view your conversation!</p>
                ) : (
                  <p>
                    {selectedConversation ? (
                      <>
                        <p>
                          You have a conversation with {currFriendObj.realname}.
                        </p>
                        {/* Display all messages in the selected conversation */}
                        {/*selectedConversation.messages.map((message, index) => (
                            <div key={index} className={`mb-2 ${message.senderUid === userId ? ' text-sm ml-auto bg-gray-300' : ' text-sm bg-blue-500 text-white'} p-2 rounded-md`} style={{ maxWidth: '75%' }}>
                              <p className="font-semibold">{message.senderUid === userId ? 'You' : currFriendObj.realname}:</p>
                              <p>{message.content}</p>
                              <p className="text-gray-500 text-xs mt-1">{new Date(message.sent).toLocaleString()}</p>
                            </div>
                          ))*/}

                        {selectedConversation.messages.map((message, index) => {
                          const isUserMessage = message.senderUid === userId;
                          // Regular expression to match Tenor GIF URLs
                          //const tenorGifRegex = /^https?:\/*\/tenor\.com\/view\/.*$/i;
                          const tenorGifRegex = /^https:\/\/.*tenor\.com.*$/;
                          // Check if the message content contains a Tenor GIF URL
                          const containsTenorGif = tenorGifRegex.test(
                            message.content
                          );
                          console.log("reg test");
                          console.log(containsTenorGif);
                          return (
                            <div
                              key={index}
                              className={`mb-2 ${
                                message.senderUid === userId
                                  ? " text-sm ml-auto bg-gray-300"
                                  : " text-sm bg-blue-500 text-white"
                              } p-2 rounded-md`}
                              style={{ maxWidth: "75%" }}
                            >
                              <div
                                className={`mb-2 ${
                                  isUserMessage
                                    ? "bg-gray-300"
                                    : "bg-blue-500 text-white"
                                } p-2 rounded-md`}
                                style={{ maxWidth: "75%" }}
                              >
                                <p className="font-semibold">
                                  {message.senderUid === userId
                                    ? "You"
                                    : currFriendObj.realname}
                                  :
                                </p>
                                {/* Check if the message contains a Tenor GIF */}
                                {containsTenorGif ? (
                                  // If a Tenor GIF is present, embed it
                                  <img src={message.content} alt="Tenor GIF" />
                                ) : (
                                  // If no Tenor GIF is present, display the message content
                                  <p>{message.content}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">
                                  {new Date(message.sent).toLocaleString()}
                                </p>
                              </div>
                              {!isUserMessage && (
                                <div>
                                  <div>
                                    {!interactionActive && (
                                      <div>
                                        <button
                                          onClick={() => handleReply(message)}
                                          className="ml-2 button"
                                        >
                                          Reply
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleReact(message, message.uid)
                                          }
                                          className="ml-2 button"
                                        >
                                          React
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      `Send a message to start a new conversation with ${currFriendObj.realname}!`
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center mt-4">
              {!showReactions ? (
                <>
                  <input
                    type="text"
                    id="messageInput"
                    placeholder={placeholder}
                    className="w-full p-3 ml-1 mb-1 border border-gray-300 rounded-l-md"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  {interactionActive &&
                    (replyingToMessage || showReactions) && (
                      <button
                        onClick={handleCancelReact}
                        className="button ml-2"
                      >
                        Cancel
                      </button>
                    )}
                </>
              ) : (
                <div>
                  {["❤️", "👍", "😂", "👎", "😈", "🔊", "🔇"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="button rounded-r-md ml-2 mb-1"
                    >
                      {emoji}
                    </button>
                  ))}
                  <button onClick={handleCancelReact} className="button ml-2">
                    Cancel
                  </button>
                </div>
              )}
              <button
                onClick={handleSendMessage}
                className="button rounded-r-md ml-2 mb-1"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
              <button
                onClick={handleVoiceInput}
                className="button rounded-r-md ml-2 mb-1"
              >
                <FontAwesomeIcon
                  icon={listening ? faMicrophoneSlash : faMicrophone}
                />
              </button>
              <button
                onClick={handleGif}
                className="button rounded-r-md ml-2 mb-1"
              >
                gif
              </button>
              {gifModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                  <div className="bg-white p-4 rounded-md">
                    <div
                      id="share_gifs_container"
                      className="overflow-y-auto max-h-96"
                    >
                      {renderGifs()}
                    </div>
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
