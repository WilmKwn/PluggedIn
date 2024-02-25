import React, { useEffect, useState } from "react";

import axios from "axios";
import MainBanner from "./MainBanner";
import "../App.css";
import "../index.css";
import MainBottomBar from "./MainBottomBar";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState([
    { by: "Artists", checked: true },
    { by: "Songs", checked: true },
    { by: "Posts", checked: true },
  ]);

  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [posts, setPosts] = useState([]);

  const changeCheckbox = (index) => {
    const newObject = filters.map((filter, i) => {
      if (i === index) return { ...filter, checked: !filter.checked };
      return filter;
    });
    setFilters(newObject);
  };

  const updateSeatch = (e) => {
    setSearchText(e.target.value);

    const filterFetched = (arr) => {
      const filtered = arr.map((item) => {
        return item;
      });
      return filtered;
    };

    if (filters[0].checked) {
      axios
        .get("http://localhost:5001/user")
        .then((res) => {
          setArtists(filterFetched(res.data));
        })
        .catch((err) => console.log(err.message));
    } else if (filters[1].checked) {
      axios
        .get("http://localhost:5001/song")
        .then((res) => {
          setSongs(filterFetched(res.data));
        })
        .catch((err) => console.log(err.message));
    } else if (filters[1].checked) {
      axios
        .get("http://localhost:5000/post")
        .then((res) => {
          setPosts(filterFetched(res.data));
        })
        .catch((err) => console.log(err.message));
    }
  };

  const ArtistCard = ({ artist }) => {
    return <div className="w-auto m-2 p-2 h-32 bg-gray-400">Artist</div>;
  };
  const SongCard = ({ song }) => {
    return <div className="w-auto m-2 p-2 h-32 bg-gray-400">Song</div>;
  };
  const PostCard = ({ post }) => {
    return <div className="w-auto m-2 p-2 h-32 bg-gray-400">Post</div>;
  };

  return (
    <div>
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
          {artists.length > 0 && filters[0].checked && (
            <div className="flex flex-col w-1/3">
              <p className="text-2xl text-center pt-1 border-2 border-black">
                Artists
              </p>
              {artists.map((artist, index) => (
                <ArtistCard key={index} artist={artist} />
              ))}
            </div>
          )}
          {songs.length > 0 && filters[1].checked && (
            <div className="flex flex-col w-1/3">
              <p className="text-2xl text-center pt-1 border-2 border-black">
                Songs
              </p>
              {songs.map((song, index) => (
                <SongCard key={index} song={song} />
              ))}
            </div>
          )}
          {posts.length > 0 && filters[2].checked && (
            <div className="flex flex-col w-1/3">
              <p className="text-2xl text-center pt-1 border-2 border-black">
                Posts
              </p>
              {posts.map((post, index) => (
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
