import mongoose from "mongoose";

const userSchema = mongoose.Schema(

    // Replace the ref: parameters with the correct table name
    {
        uid: {
            type: String,
            required: true,
        },
        realname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        accountType: {
            type: Number,
            required: true,
        },
        profilePic: {
            type: String,
        },
        genre: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        projects: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'project',
            required: true,
        },
        skills: {
            type: [String], 
            required: true,
        },
        tracks: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'songs',
            required: true,
        },
        friends: {
            type: [String],
            required: true,
        },
        endorsed: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'users',
            required: true,
        },
        outgoingRequests: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'users',
            required: true,
        },
        recentActivity: {
            type: [mongoose.Schema.Types.ObjectId],
            validate: {
                validator: function(arr) {
                    return arr.length <= 5;
                },
                message: props => `${props.value.length} exceeds the limit of 5 items for recent activity.`
            },
            required: true,
        },
    }
);

export const User = mongoose.model('users', userSchema);
