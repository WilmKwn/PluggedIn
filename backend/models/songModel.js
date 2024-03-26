import mongoose from "mongoose";

const songSchema = mongoose.Schema(
    {
        title: {
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
        owner: {
            type: String,
            required: true
        },
        isTag: {
            type: Boolean,
            required: true
        }
    }
);

export const Song = mongoose.model('song', songSchema);