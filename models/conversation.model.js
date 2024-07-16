import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

conversationSchema.virtual("messages", {
  ref: "Message",
  foreignField: "chatId",
  localField: "_id",
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
