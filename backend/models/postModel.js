import mongoose from "mongoose";

const postSchema = mongoose.Schema(

    // MAKE SURE TO ADD TOGGLE FOR NORMAL POSTS AND PROJECT POSTS
    {
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
        owner: {
            type: String,
            required: true
        },
        comments: [{
            text: String,
            owner: String,
            postedAt: { type: Date, default: Date.now() }
        }],
        reactions: {
            likes: { type: Number, default: 0 },
            dislikes: { type: Number, default: 0 },
            laughs: { type: Number, default: 0 }
        }
    }
);

export const Post = mongoose.model('post', postSchema);