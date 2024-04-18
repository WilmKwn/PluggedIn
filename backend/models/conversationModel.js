import mongoose from "mongoose";
const messageSchema = mongoose.Schema({
  senderUid: {
    type: String,
    required: true,
  },
  sent: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isReply: {
    type: Boolean,
    required: true,
    default: false, // Default is false, indicating most messages are not replies.
  },
});
const conversationSchema = mongoose.Schema(
  // Replace the ref: parameters with the correct table name
  {
    uid: {
      type: String,
      required: true,
    },
    user1id: {
      // first alphabetically
      type: String,
      required: true,
    },
    user2id: {
      type: String,
      required: true,
    },
    messages: {
      type: [messageSchema],
      required: false,
    },
  }
);

export const Conversation = mongoose.model("conversations", conversationSchema);
