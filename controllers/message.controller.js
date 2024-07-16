import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const sortArr = [senderId, receiverId].sort();

    let conversation = await Conversation.findOneAndUpdate(
      {
        participants: sortArr,
      },
      { updatedAt: new Date() }
    );

    if (!conversation) {
      conversation = await Conversation.create({
        participants: sortArr,
      });
    }

    const newMessage = new Message({
      senderId,
      chatId: conversation._id,
      message,
      seen: false,
    });

    // newMessage && conversation.messages.push(newMessage._id);

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

export const getMessages = async (req, res, next) => {
  try {
    const { id: userToChatId } = req.params;
    const me = req.user._id;

    const sortArr = [me, userToChatId].sort();
    console.log(sortArr);

    const conversation = await Conversation.findOne({
      participants: sortArr,
    })
      .populate("messages")
      .sort({ createdAt: -1 });

    conversation?.messages.forEach(async () => {
      await Message.findOneAndUpdate(
        { senderId: userToChatId },
        {
          seen: true,
        }
      );
    });

    return res.status(200).json(conversation?.messages || []);
    // const conversation2 = await Conversation.findOne({
    //   participants: [userToChatId, me],
    // })
    //   .populate("messages")
    //   .sort({ createdAt: -1 });

    // const result = [
    //   ...(conversation1?.messages || []),
    //   ...(conversation2?.messages || []),
    // ].sort((a, b) => {
    //   var dateA = new Date(a.createdAt).getTime();
    //   var dateB = new Date(b.createdAt).getTime();
    //   return dateA > dateB ? 1 : -1;
    // });

    // conversation2?.forEach(async (message) => {
    //   const seenMessage = await Message.findByIdAndUpdate(message._id, {
    //     seen: true,
    //   });
    // });

    // res.status(200).json(result);
  } catch (err) {
    // next(err);
    console.error("Error in get messages controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};
