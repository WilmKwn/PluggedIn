import mongoose from "mongoose";

const postSchema = mongoose.Schema(

    // MAKE SURE TO ADD TOGGLE FOR NORMAL POSTS AND PROJECT POSTS
    {
        uid: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        media: {
            type: String,
        },
        tags: {
            type: [String],
            required: true,
        },
        archived: {
            type: Boolean,
            required: true,
        },
        news: {
            type: Boolean,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
    }
);

export const Post = mongoose.model('post', postSchema);