import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import MainBanner from "./MainBanner";
import "../App.css";
import "../index.css";
import MainBottomBar from "./MainBottomBar";

const Search = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState([
    { by: "Artists", checked: true },
    { by: "Songs", checked: true },
    { by: "Posts", checked: true },
  ]);

  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [posts, setPosts] = useState([]);

  const [showArtists, setShowArtists] = useState([]);
  const [showSongs, setShowSongs] = useState([]);
  const [showPosts, setShowPosts] = useState([]);

  useEffect(() => {
    if (filters[0].checked) {
      axios
        .get("http://localhost:5001/user")
        .then((res) => {
          setArtists(res.data);
        })
        .catch((err) => console.log(err.message));
    }
    if (filters[1].checked) {
      axios
        .get("http://localhost:5001/song")
        .then((res) => {
          setSongs(res.data);
        })
        .catch((err) => console.log(err.message));
    }
    if (filters[2].checked) {
      axios
        .get("http://localhost:5001/post")
        .then((res) => {
          setPosts(res.data);
        })
        .catch((err) => console.log(err.message));
    }
  }, []);

  const changeCheckbox = (index) => {
    const newObject = filters.map((filter, i) => {
      if (i === index) return { ...filter, checked: !filter.checked };
      return filter;
    });
    setFilters(newObject);
  };

  const updateSeatch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchText(search);

    let temp = [];
    temp = artists.filter((artist) => {
      if (artist.realname.toLowerCase().includes(search)) {
        return artist;
      }
    });
    setShowArtists(temp);

    temp = songs.filter((song) => {
      // TODO
      return song;
    });
    setShowSongs(temp);

    temp = posts.filter((post) => {
      if (post.title.toLowerCase().includes(search) || post.description.toLowerCase().includes(search)) {
        return post;
      }
    });
    setShowPosts(temp);
  };

  const artistClicked = (id) => {
    const userId = id;
    navigate("/profile", {state: {userId}});
  }

  const ArtistCard = ({ artist }) => {
    return (
      <div onClick={()=>{artistClicked(artist.uid)}} className="w-auto m-2 p-2 h-32 bg-gray-400 hover:scale-105 duration-200 cursor-pointer">
        {artist.realname}
      </div>
    );
  };
  const SongCard = ({ song }) => {
    return (
      <div className="w-auto m-2 p-2 h-32 bg-gray-400 hover:scale-105 duration-200 cursor-pointer">
        Song
      </div>
    );  };
  const PostCard = ({ post }) => {
    return (
      <div className="w-auto m-2 p-2 h-32 bg-gray-400 hover:scale-105 duration-200 cursor-pointer">
        {post.title}
      </div>
    );  };

  return (
    <div className="mb-72">
      <MainBanner />
      <div className="w-full h-screen flex flex-col items-center pt-32">
        <input
          type="text"
          placeholder="Enter here"
          value={searchText}
          onChange={(e) => updateSeatch(e)}
          className="w-2/3 h-12 border-2 border-black pl-3"
        />
        <div className="w-1/5 flex justify-between mt-1 mb-1">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-2 border-2"
            >
              <p className="text-md">{filter.by}</p>
              <input
                className=""
                type="checkbox"
                id={index}
                checked={filter.checked}
                onChange={() => {
                  changeCheckbox(index);
                }}
              />
            </div>
          ))}
        </div>

        <div className="w-4/5 h-full flex justify-center ">
          {showArtists.length > 0 && filters[0].checked && (
            <div className="flex flex-col w-1/3">
              <p className="text-2xl text-center pt-1 border-2 border-black">
                Artists
              </p>
              {showArtists.map((artist) => (
                <ArtistCard key={artist.uid} artist={artist} />
              ))}
            </div>
          )}
          {showSongs.length > 0 && filters[1].checked && (
            <div className="flex flex-col w-1/3">
              <p className="text-2xl text-center pt-1 border-2 border-black">
                Songs
              </p>
              {showSongs.map((song, index) => (
                <SongCard key={index} song={song} />
              ))}
            </div>
          )}
          {showPosts.length > 0 && filters[2].checked && (
            <div className="flex flex-col w-1/3">
              <p className="text-2xl text-center pt-1 border-2 border-black">
                Posts
              </p>
              {showPosts.map((post, index) => (
                <PostCard key={index} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
      <MainBottomBar />
    </div>
  );
};
export default Search;
