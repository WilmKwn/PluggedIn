import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
    }
);

export const Post = mongoose.model('post', postSchema);