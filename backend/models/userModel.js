import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        accountType: {
            type: Number,
            required: true,
        },
        profilePicture: {
            data: Buffer,
            contentType: String,
        },
    }
);

export const User = mongoose.model('user', userSchema);