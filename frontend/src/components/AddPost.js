import React, { useEffect, useState } from "react";
import SecondaryBanner from "./SecondaryBanner";
import SecondaryBottomBar from "./SecondaryBottomBar";
import axios from "axios";
import { auth, storage, ref, uploadBytes } from "./firebase";
import { useNavigate } from "react-router-dom";
import Switch from "react-ios-switch";
import { faHandMiddleFinger } from "@fortawesome/free-solid-svg-icons";
import "../AddPost.css";

const AddPost = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postMedia, setPostMedia] = useState(null);
  const [postMediaName, setPostMediaName] = useState("Add Post +");
  const [postTags, setPostTags] = useState("");
  const [isNewsAccount, setIsNewsAccount] = useState(false);
  const [isSong, setIsSong] = useState(false);
  const [isProducerTag, setIsProducerTag] = useState(false);
  const [isNews, setIsNews] = useState(false);
  const [isJob, setIsJob] = useState(false);
  const loggedInId = localStorage.getItem(
    "actualUserIdBecauseWilliamYongUkKwonIsAnnoying"
  );

  const navigate = useNavigate();

  const isAudioOrVideo = (fileName) => {
    const fileExtension = fileName.split(".").pop().toLowerCase();
    return ["mp3", "wav", "mp4", "avi", "flv", "wmv"].includes(fileExtension);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setPostMedia(file);
    setPostMediaName(file.name);

    setIsSong(false);
    setIsNews(false);
    setIsJob(false);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5001/user/${loggedInId}`)
      .then((res) => {
        console.log("got loggedIn data");
        if (res.data.accountType === 2) {
          setIsNewsAccount(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  const handleSongSwitchChange = (newValue) => {
    setIsSong(newValue);
    if (newValue) {
      setIsNews(false);
      setIsJob(false);
    }
  };

  const handleNewsSwitchChange = (newValue) => {
    setIsNews(newValue);
    if (newValue) {
      setIsSong(false);
      setIsProducerTag(false);
      setIsJob(false);
    }
  };

  const handleJobSwitchChange = (newValue) => {
    setIsJob(newValue);
    if (newValue) {
      setIsSong(false);
      setIsProducerTag(false);
      setIsNews(false);
    }
  };

  const handleTagSwitchChange = (newValue) => {
    setIsProducerTag(newValue);
    if (newValue) {
      setIsNews(false);
    }
  };

  const handleSubmit = async () => {
    const creationDate = new Date();

    let tagsArray = ["#foryou"];

    if (isSong) {
      tagsArray.push("#song");
    }
    if (isProducerTag) {
      tagsArray.push("#producertag");
    }
    if (isNews) {
      tagsArray.push("#news");
    }
    if (isJob) {
      tagsArray.push("#job");
    }

    if (postTags.trim()) {
      const additionalTags = postTags.split(",").map((tag) => `#${tag.trim()}`);
      tagsArray = [...tagsArray, ...additionalTags];
    }

    // The tags array now contains all hashtags including the default and any user-provided tags

    // Create the post object with all necessary data
    const post = {
      title: postTitle,
      description: postDescription,
      media: postMediaName,
      tags: tagsArray, // Use the array of hashtags directly
      archived: false,
      news: isNews,
      date: creationDate,
      owner: auth.currentUser.uid,
      comments: [],
      reactions: {
        likes: 0,
        dislikes: 0,
        laughs: 0,
      },
      isSong: isSong,
      hiddenBy: [],
    };

    // Attempt to submit the post
    try {
      // Upload the media if present
      if (postMedia) {
        console.log("post/" + postMediaName);
        const picRef = ref(storage, "post/" + postMediaName);
        await uploadBytes(picRef, postMedia);
        console.log("Successfully uploaded media");
      }
      // Submit the post data
      await axios.post("http://localhost:5001/post", post);
      console.log("Post submitted successfully");
      // Navigate the user to the feed page upon success
      navigate("/feed");
    } catch (err) {
      // Log any errors that occur during the submission process
      console.log("Error submitting post", err.message);
    }

    // ignore this comment
    // ignore this 2

    if (isSong || isProducerTag) {
      const song = {
        title: postTitle,
        media: postMediaName,
        tags: tagsArray,
        owner: auth.currentUser.uid,
        isTag: isProducerTag,
      };
      axios.post("http://localhost:5001/song", song);
    }

    // Reset form fields to their default values after submission
    setPostTitle("");
    setPostDescription("");
    setPostMediaName("");
    setPostMedia(null);
    setPostTags("");
    setIsSong(false);
    setIsNews(false); // Reset the news switch as well
  };

  return (
    <div>
      <SecondaryBanner />
      <div className="w-full h-full text-center pt-28 mb-96">
        <div className="input-container">
          <input
            type="text"
            placeholder="Title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
            className="textarea-field"
          />
          <div className="file-input-container">
            <label htmlFor="file-upload" className="custom-file-upload">
              {postMediaName}
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleMediaChange}
              style={{ display: "none" }} // Hide the default file input
            />
          </div>

          <div>&nbsp;</div>
          {postMedia && isAudioOrVideo(postMediaName) && (
            <div>
              <div className="switch-container">
                <span className="switch-label">Song</span>
                <Switch
                  checked={isSong}
                  onChange={handleSongSwitchChange}
                  onColor="#007AFF"
                  offColor="#E5E5EA"
                />
              </div>
              <div className="switch-container">
                <span className="switch-label">Producer Tag</span>
                <Switch
                  checked={isProducerTag}
                  onChange={handleTagSwitchChange}
                  onColor="#007AFF"
                  offColor="#E5E5EA"
                />
              </div>
            </div>
          )}
          {isNewsAccount && (
            <div className="switch-container">
              <span className="switch-label">News</span>
              <Switch
                checked={isNews}
                onChange={handleNewsSwitchChange}
                onColor="#007AFF"
                offColor="#E5E5EA"
              />
            </div>
          )}
          <div className="switch-container">
            <span className="switch-label">Job</span>
            <Switch
              checked={isJob}
              onChange={handleJobSwitchChange}
              onColor="#007AFF"
              offColor="#E5E5EA"
            />
          </div>
          <input
            type="text"
            placeholder="Tags"
            value={postTags}
            onChange={(e) => setPostTags(e.target.value)}
            className="input-field tags-input" // Added 'tags-input' class for specific styling
          />
          <button onClick={handleSubmit} className="button-submit">
            Submit
          </button>
        </div>
      </div>

      <SecondaryBottomBar />
    </div>
  );
};

export default AddPost;
