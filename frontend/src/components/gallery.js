import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

import { storage, ref, getDownloadURL } from "./firebase";

import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import MainBanner from "./MainBanner";
import "../App.css";
import "../index.css";
import MainBottomBar from "./MainBottomBar";
import Post from "./Post";

const Gallery = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/post")
      .then((res) => {
        const fetchedPosts = res.data;
        const filteredPosts = fetchedPosts.reverse().filter((post) => {
          return post.tags.includes("#song");
        });
        setPosts(filteredPosts);
      })
      .catch((err) => {
        console.log("Cant load posts: ", err);
      });
  }, []);

  const Card = ({ post }) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [media, setMedia] = useState(null);

    useEffect(() => {
      axios.get(`http://localhost:5001/user/${post.owner}`).then((res) => {
        const user = res.data;
        setName(user.realname);

        const picRef = ref(storage, "user/" + user.profilePic);
        getDownloadURL(picRef)
          .then((url) => {
            setImage(url);
          })
          .catch((err) => {
            console.log(err);
          });

        const mediaRef = ref(storage, "post/" + post.media);
        getDownloadURL(mediaRef)
          .then((url) => {
            setMedia(url);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }, []);

    return (
      <div className="w-5/12 h-52 bg-gray-300 border-2 border-black mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {image === "No file chosen" ? (
              <div className="w-12 h-12 bg-white rounded-xl m-1"></div>
            ) : (
              <img className="w-12 rounded-xl" src={image} />
            )}
            <p className="text-md pl-2">{name}</p>
          </div>
          <p className="mr-2">{post.date.substring(0, 10)}</p>
        </div>
        <p className="pb-2 font-bold">{post.title}</p>
        <div className="w-full bg-gray-200 h-auto flex flex-col">
          <p>{post.description}</p>
        </div>
        <img className="w-full h-24" src={media} />
      </div>
    );
  };

  return (
    <div className="container">
      <MainBanner />
      <div className="w-full h-full text-center pt-28">
        <div className="w-full h-full flex flex-col items-center pt-5 pb-20">
          {posts.length === 0 && (
            <div>Hello! This is your feed, a place to view humblebrags.</div>
          )}
          {posts.map((post, index) => (
            <Post key={index} postParam={post} />
          ))}
        </div>
      </div>
      <MainBottomBar />
    </div>
  );
};

export default Gallery;
