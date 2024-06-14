import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: [senderId, receiverId],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    newMessage && conversation.messages.push(newMessage._id);

    // await conversation.save();
    // await newMessage.save();

    // This will run in paralllel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverId(receiverId);
    receiverSocketId && io.to(receiverSocketId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error in send message controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation1 = await Conversation.findOne({
      participants: [senderId, userToChatId],
    }).populate("messages");
    const conversation2 = await Conversation.findOne({
      participants: [userToChatId, senderId],
    }).populate("messages");

    res
      .status(200)
      .json([
        ...(conversation1?.messages || []),
        ...(conversation2?.messages || []),
      ]);
  } catch (err) {
    console.error("Error in get messages controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};
