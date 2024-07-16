import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      dafault: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

export const messageSchema2 = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      dafault: false,
    },
  },
  { timestamps: true }
);
