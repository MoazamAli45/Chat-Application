const data = require("../data/data");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
// exports.getChat = (req, res) => {
//   res.status(200).json({
//     success: true,
//     data,
//   });
// };

exports.accessChat = catchAsync(async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new AppError("Please Provide User Id", 400);
  //  If chat already present then send that chat
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.user._id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  // console.log("isChat", isChat);
  //
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  if (isChat.length > 0) {
    return res.status(200).json({
      success: true,
      chat: isChat[0],
    });
  }
  //   Now I have to create the chat
  try {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, req.user._id],
    };
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id)
      .populate("users", "-password")
      .populate("latestMessage");
    res.status(200).json({
      success: true,
      chat: fullChat,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      err,
    });
  }
});
