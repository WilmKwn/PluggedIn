import React, { useState } from "react";
import SecondaryBanner from "./SecondaryBanner";
import SecondaryBottomBar from "./SecondaryBottomBar";
import axios from "axios";
import { auth, storage, ref, uploadBytes } from "./firebase";
import { useNavigate } from "react-router-dom";
import Switch from "react-ios-switch";
import { faHandMiddleFinger } from "@fortawesome/free-solid-svg-icons";

const AddPost = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postMedia, setPostMedia] = useState(null);
  const [postMediaName, setPostMediaName] = useState("");
  const [postTags, setPostTags] = useState("");

  const [isSong, setIsSong] = useState(false);
  const [isProducerTag, setIsProducerTag] = useState(false);
  const [isNews, setIsNews] = useState(false);
  const [isJob, setIsJob] = useState(false);

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
      hiddenBy: []
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
    
    if (isSong || isProducerTag) {
      const song = {
        title: postTitle,
        media: postMediaName,
        tags: tagsArray,
        owner: auth.currentUser.uid,
        isTag: isProducerTag
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
        <div className="w-full h-full flex flex-col items-center pt-5">
          <div className="w-1/2 h-1/2">
            <input
              type="text"
              placeholder="Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full h-10 mb-3 border-2 border-black"
            />
            <textarea
              placeholder="Description"
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              className="w-full h-32 mb-3 border-2 border-black"
            />
            <input
              type="file"
              placeholder="Media"
              onChange={handleMediaChange}
              className="w-full h-10 mb-3 border-2 border-black"
            />
            {postMedia && isAudioOrVideo(postMediaName) && (
              <div>
                <div className="flex items-center justify-center mb-3">
                  <span className="mr-2">Song</span>
                  <Switch
                    checked={isSong}
                    onChange={handleSongSwitchChange} // Updated to use the new handler
                    onColor="#007AFF"
                    offColor="#E5E5EA"
                  />
                </div>
                <div className="flex items-center justify-center mb-3">
                  <span className="mr-2">Producer Tag</span>
                  <Switch
                    checked={isProducerTag}
                    onChange={handleTagSwitchChange} // Updated to use the new handler
                    onColor="#007AFF"
                    offColor="#E5E5EA"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-center mb-3">
              <span className="mr-2">News</span>
              <Switch
                checked={isNews}
                onChange={handleNewsSwitchChange} // Updated to use the new handler
                onColor="#007AFF"
                offColor="#E5E5EA"
              />
            </div>
            <div className="flex items-center justify-center mb-3">
              <span className="mr-2">Job</span>
              <Switch
                checked={isJob}
                onChange={handleJobSwitchChange} // Updated to use the new handler
                onColor="#007AFF"
                offColor="#E5E5EA"
              />
            </div>
            <input
              type="text"
              placeholder="Tags"
              value={postTags}
              onChange={(e) => setPostTags(e.target.value)}
              className="w-full h-10 mb-3 border-2 border-black"
            />
            <button onClick={handleSubmit} className="w-full h-10 bg-blue-500">
              Submit
            </button>
          </div>
        </div>
        <SecondaryBottomBar />
      </div>
    </div>
  );
};

export default AddPost;
