const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const sendMessage = catchAsync(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    throw new AppError("Please Provide Content and Chat Id", 400);
  }
  const messageData = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  //    On CREATING YOU CAN'T POPULATE DIRECTLY
  let message = await Message.create(messageData);
  message = await message.populate("sender", "name profilePic");
  message = await message.populate("chat");
  //     NOW POPULATING THE CHATS OF USERS
  //    POPULATING USING USER MODEL BELOW CODE IS SAME
  //   message = await User.populate(message, {
  //     path: "chat.users",
  //     select: "name profilePic email",
  //   });

  //   EASY THEN ABOVE COMMENTED CODE
  message = await message.populate("chat.users", "name profilePic email");

  //    NOW UPDATING THE CHAT LATEST MESSAGE
  Chat.findByIdAndUpdate(chatId, {
    latestMessage: message,
  });
  if (!message) {
    throw new AppError("Message Not Sent", 500);
  }

  res.status(200).json({
    success: true,
    message,
  });
});

// @description to get all messages of a chat
const getAllMessages = catchAsync(async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chat: chatId })
    .populate("sender", "-password")
    .populate("chat");

  if (!messages) {
    throw new AppError("No Message Found", 404);
  }
  res.status(200).json({
    success: true,
    messages,
  });
});

module.exports = { sendMessage, getAllMessages };
