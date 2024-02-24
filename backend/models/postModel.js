import mongoose from "mongoose";

const postSchema = mongoose.Schema(

    // MAKE SURE TO ADD TOGGLE FOR NORMAL POSTS AND PROJECT POSTS
    {
        email: {
            type: String,
            required: true,
        },
    }
);

export const Post = mongoose.model('post', postSchema);