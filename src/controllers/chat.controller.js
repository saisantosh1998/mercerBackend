const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { chatService, userService } = require("../services");

// controller layer for creating single chat and passing desired details to service function
// sends 200 response on succesfull creation
const createChat = catchAsync(async (req, res) => {
  const { email } = req.user;
  // to get the user details of logined user
  const user = await userService.getUserByEmail(email);
  const chat = await chatService.createChat(user._id, req.body.userId);
  res.status(httpStatus.OK).json(chat);
});

// controller layer for getting all chats for particular user
// sends 200 response on succesful response
const getChats = catchAsync(async (req, res) => {
  const { email } = req.user;
  // to get the user details of logined user
  const user = await userService.getUserByEmail(email);
  const chats = await chatService.getChats(user);
  res.status(httpStatus.OK).json(chats);
});

// controller layer for getting all group chats existing in database
// sends 200 response on succesful response
const getGroups = catchAsync(async (req, res) => {
  const { email } = req.user;
  // to get the user details of logined user 
  const user = await userService.getUserByEmail(email);
  const chats = await chatService.getGroups(user._id,req.query.groupName);
  res.status(httpStatus.OK).json(chats);
});

// controller layer for creating group chat for bunch of users
// sends 200 response on succesful response
const createGroupChat = catchAsync(async (req, res) => {
  const { email } = req.user;
  // to get the user details of logined user 
  const user = await userService.getUserByEmail(email);
  const groupChat = await chatService.createGroupChat(user._id, req.body);
  res.status(httpStatus.OK).json(groupChat);
});

// controller layer for changing the name of  particular group
// sends 200 response on succesful response
const renameGroupChat = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const groupChat = await chatService.renameGroupChat(groupId, req.body.groupName);
  res.status(httpStatus.OK).json(groupChat);
});

// controller layer for removing user from particular group
// sends 200 response on succesful response
const removeUser = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const groupChat = await chatService.removeUserFromGroup(groupId, req.body.userId);
  res.status(httpStatus.OK).json(groupChat);
});

// controller layer for adding user to particular group
// sends 200 response on succesful response
const addUser = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const groupChat = await chatService.addUserFromGroup(groupId, req.body.userId);
  res.status(httpStatus.OK).json(groupChat);
});

module.exports = {
  createChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  removeUser,
  addUser,
  getGroups,
};
