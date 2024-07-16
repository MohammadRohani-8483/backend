import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const getConversation = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const conversations = await Conversation.find({
      participants: { $in: [loggedInUserId] },
    })
      .populate({
        path: "participants",
        select: "fullName username profilePic gender createdAt updatedAt",
      })
      .populate({
        path: "messages",
        select: "senderId message seen createdAt",
        options: { sort: { updatedAt: -1 } },
      })
      .sort({ updatedAt: -1 });

    const response = conversations.map((conversation) => {
      const lastMessage = conversation.messages[0];
      const notSeenMessages = conversation.messages.filter(
        (message) =>
          message.senderId.toString() !== loggedInUserId.toString() &&
          !message.seen
      ).length;
      return {
        id: conversation._id,
        user: conversation.participants.filter(
          (participant) =>
            participant._id.toString() !== loggedInUserId.toString()
        )[0],
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        lastMessage,
        notSeenMessages,
      };
    });
    res.status(200).json(response);
  } catch (err) {
    console.error("Error in get conversation controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};
