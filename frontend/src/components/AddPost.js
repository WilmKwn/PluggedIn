import React, { useState } from "react";
import SecondaryBanner from './SecondaryBanner';
import SecondaryBottomBar from "./SecondaryBottomBar";
import axios from 'axios';

// Still need to format CSS


const AddPost = () => {
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postMedia, setPostMedia] = useState("");
    const [postTags, setPostTags] = useState("");

    const handleSubmit = async () => {
        // create a post object
        const postID = Date.now().toString();
        const creationDate = new Date();
        const archived = false;
        const news = false;
        const post = {
            id: postID,
            title: postTitle,
            description: postDescription,
            media: postMedia,
            tags: postTags,
            archived: archived,
            news: news,
            date: creationDate
        }

        // submit the post to the database
        try {
            await axios.post("http://localhost:5000/post", post);
            console.log("Post submitted successfully")
        } catch (err) {
            console.log("Error submitting post", err.message);
        }

        setPostTitle("");
        setPostDescription("");
        setPostMedia("");
        setPostTags("");
    }
    return (
        <div>
            <SecondaryBanner />
            <div className="w-full h-full text-center pt-28">
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
                            value={postMedia}
                            onChange={(e) => setPostMedia(e.target.value)}
                            className="w-full h-10 mb-3 border-2 border-black"
                        />
                        <input
                            type="text"
                            placeholder="Tags"
                            value={postTags}
                            onChange={(e) => setPostTags(e.target.value)}
                            className="w-full h-10 mb-3 border-2 border-black"
                        />
                        <button onClick={handleSubmit}
                            className="w-full h-10 bg-blue-500"
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <SecondaryBottomBar />
            </div>
        </ div>
    );
}

export default AddPost;