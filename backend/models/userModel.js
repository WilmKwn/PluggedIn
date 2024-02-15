import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        accountType: {
            type: Number,
            required: true,
        },
        profilePicture: {
            type: String,
        },
    }
);

export const User = mongoose.model('user', userSchema);