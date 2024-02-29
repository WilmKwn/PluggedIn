import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
    {
        senderUid: {
            type: String,
            required: true
        },
        sent: {
            type: Date,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }
);
const conversationSchema = mongoose.Schema(

    // Replace the ref: parameters with the correct table name
    {
        uid: {
            type: String,
            required: true,
        },
        user1id: { // first alphabetically
            type: String,
            required: true,
        },
        user2id: {
            type: String,
            required: true,
        },
        messages: {
            type: [messageSchema],
            required: false
        }
        
    }
);

export const Conversation = mongoose.model('conversations', conversationSchema);
