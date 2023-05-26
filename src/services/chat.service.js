const { Chat, User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * returns an object that contains the chat details if chat exists it will return
 *  recent chat or it will create and returns that object
 * @param {string} currentUserId
 * @param {string} senderId
 * @returns {Object}
 */
const createChat = async (currentUserId, senderId) => {
  // getting chat details using chat mongo model and populating th user details and
  // latest message details for the recieved chats from database
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: currentUserId } } },
      { users: { $elemMatch: { $eq: senderId } } },
    ],
  })
    .populate("users")
    .populate("latestMessage");

  // populating the sender details of the latest message
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "email name",
  });
  if (isChat.length > 0) {
    return isChat[0];
  } else {
    const chatData = {
      chatName: "sender",
      users: [currentUserId, senderId],
    };
    try {
      // creating chat with the provided chat details
      const newChat = await Chat.create(chatData);
      // getting the chat using created chat id and populating the desired details
      const fullChat = await Chat.findById(newChat._id).populate("users");
      return fullChat;
    } catch (error) {
      throw new ApiError(httpStatus.NOT_FOUND, err.message);
    }
  }
};

/**
 * returns an array og objects that contains the chat details
 * that associated with provided user details
 * @param {Object} user
 * @returns {Object[]}
 */
const getChats = async (user) => {
  // getting chat details using chat mongo model and populating th user details and
  // latest message details and group admin details for the recieved chats from database
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: user._id } },
  })
    .populate("users")
    .populate("latestMessage")
    .populate("groupAdmin")
    .sort({ updatedAt: -1 });
  // populating the sender details of the latest message field
  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "email name",
  });

  return chats;
};

/**
 * returns an array of objects that contains the group chat details
 * that associated with provided group chat name and excludes the current user 
 * since he is already part of group this API is used to join th existing groups
 * @param {string} currentUserId
 *  @param {string} groupName
 * @returns {Object[]}
 */
const getGroups = async (currentUserId, groupName) => {
  // getting chat details by using chat mongo model and
  // populating existing user details for respective
  // chat and group admin for the chat along with latest message sent
  let chats = await Chat.find({
    isGroupChat: true,
    chatName: { $regex: groupName, $options: "i" },
    users: { $nin: [currentUserId] },
  })
    .populate("users")
    .populate("latestMessage")
    .populate("groupAdmin")
    .sort({ updatedAt: -1 });
// populating the sender details of the latest message field
  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "email name",
  });
  return chats;
};

/**
 * returns an object that contains the chat details
 * for provided users data anf group name in body params
 * @param {string} currentUserId
 *  @param {Object} body
 * @returns {Object}
 */
const createGroupChat = async (currentUserId, body) => {
  const { users, groupName } = body;
  // to avoid group creation when users are less than 2
  if (users.length < 2) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Atleast add 2 users for creating  group chat"
    );
  }
  // adding current user fo existing users 
  users.push(currentUserId);
  const chatData = {
    chatName: groupName,
    isGroupChat: true,
    users: users,
    groupAdmin: currentUserId,
  };
  try {
    // creating chat with the provided chat details
    const groupChat = await Chat.create(chatData);
    // getting the chat using created chat id and populating the user and groupadmin details
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users")
      .populate("groupAdmin");
    return fullGroupChat;
  } catch (error) {
    // throwing error in case of failure in creating chat
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
};
/**
 * returns renamed group chat for provided chat id and
 * new name 
 * @param {string} groupId
 *  @param {string} groupName
 * @returns {Object}
 */
const renameGroupChat = async (groupId, groupName) => {
  // find the group chat with groupId and update name of the chat
  // populate the users and groupadmin details to return 
  const groupChat = await Chat.findByIdAndUpdate(
    groupId,
    { chatName: groupName },
    { new: true }
  )
    .populate("users")
    .populate("groupAdmin");
  if (groupChat) {
    return groupChat;
  }
  // if no chat is found with groupID thowing proper error
  throw new ApiError(httpStatus.NOT_FOUND, "No chat is found");
};

/**
 * returns modified group chat after removing provided user 
 * @param {string} groupId
 *  @param {string} userId
 * @returns {Object}
 */
const removeUserFromGroup = async (groupId, userId) => {
  // finding chat with groupId and removing the user from users array
  // by pull operation of mongoose
  const groupChat = await Chat.findByIdAndUpdate(
    groupId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users")
    .populate("groupAdmin");
  if (groupChat) {
    return groupChat;
  }
  // if no chat is found with groupID thowing proper error
  throw new ApiError(httpStatus.NOT_FOUND, "No chat is found");
};
/**
 * returns modified group chat after adding provided user 
 * @param {string} groupId
 *  @param {string} userId
 * @returns {Object}
 */
const addUserFromGroup = async (groupId, userId) => {
   // finding chat with groupId and adding the user to users array
  // by push operation of mongoose
  const groupChat = await Chat.findByIdAndUpdate(
    groupId,
    { $addToSet: { users: userId } },
    { new: true }
  )
    .populate("users")
    .populate("groupAdmin");
  if (groupChat) {
    return groupChat;
  }
  // if no chat is found with groupID thowing proper error
  throw new ApiError(httpStatus.NOT_FOUND, "No chat is found");
};

module.exports = {
  createChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  removeUserFromGroup,
  addUserFromGroup,
  getGroups,
};
