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
  }).populate("users", "-password");
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

    console.log("fullChat", fullChat);
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
//    Fatching Chats of one user

exports.fetchChat = catchAsync(async (req, res) => {
  //     Sorting on the basis of latest message
  const results = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  console.log("results", results);
  //   To populate in order to have the latest message sender details
  const chats = await User.populate(results, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  res.status(200).json({
    success: true,
    length: chats.length,
    chats,
  });
});

//   Creating Group Chat  where logged In user will also be the member of the group chat
exports.createGroupChat = catchAsync(async (req, res) => {
  const { chatName, users } = req.body;
  if (!chatName || !users) throw new AppError("Please Provide Chat Name", 400);
  if (users.length < 2)
    throw new AppError("Please Provide Atleast Two Users", 400);

  //   adding the user itself
  users.push(req.user._id);

  const chatData = {
    chatName,
    isGroupChat: true,
    users: users,
    groupAdmin: req.user._id,
  };
  const createdChat = await Chat.create(chatData);
  const fullChat = await Chat.findById(createdChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");
  res.status(200).json({
    success: true,
    chat: fullChat,
  });
});
exports.renameGroupChat = catchAsync(async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName)
    throw new AppError("Please Provide Chat Id and Chat Name", 400);
  const chat = await Chat.findById(chatId);
  if (!chat) throw new AppError("No Chat Found", 404);
  if (chat.groupAdmin.toString() !== req.user._id.toString())
    throw new AppError("You are not the admin of this group", 403);
  chat.chatName = chatName;
  await chat.save();
  const groupChat = await Chat.findById(chat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");

  res.status(200).json({
    success: true,
    groupChat,
  });
});

//  Removing User From Group Chat
exports.removeFromGroup = catchAsync(async (req, res) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) throw new AppError("No Chat Found", 404);

  //   USER CAN LEAVE BY HIMSELF
  if (
    chat.groupAdmin.toString() !== req.user._id.toString() &&
    req.user._id.toString() !== userId.toString()
  )
    throw new AppError("You are not the admin of this group", 403);

  if (!req.user._id === userId && chat.users.length <= 2)
    throw new AppError("You can not remove all the users", 403);

  const index = chat.users.indexOf(userId);
  if (index > -1) {
    chat.users.splice(index, 1);
  }
  await chat.save();
  const groupChat = await Chat.findById(chat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");

  res.status(200).json({
    success: true,
    groupChat,
  });
});
exports.addMemberToGroup = catchAsync(async (req, res) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) throw new AppError("No Chat Found", 404);
  if (chat.groupAdmin.toString() !== req.user._id.toString())
    throw new AppError("You are not the admin of this group", 403);
  //   Matching if all ready user present then throw error
  if (chat.users.includes(userId))
    throw new AppError("User is already present in the group", 403);

  //      RESTRICITNG TO ADD MORE THAN 10 USERS
  // if (chat.users.length >= 10)
  //   throw new AppError("You can not add more than 10 users", 403);
  chat.users.push(userId);
  await chat.save();
  const groupChat = await Chat.findById(chat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");

  res.status(200).json({
    success: true,
    groupChat,
  });
});
