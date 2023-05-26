const { Chat, User, Message } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * returns an object that contains the message details after message creation
 * @param {string} currentUserId
 * @param {Object} body
 * @returns {Object}
 */
const createMessage = async (currentUserId, body) => {
  const { content, chatId } = body;
  messageData = {
    sender: currentUserId,
    content: content,
    chat: chatId,
  };
  // creating message dcument using provided message data
  const message = await Message.create(messageData);
  if (message) {
    // populating sender user details and chat details
    let fullMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("chat");
    // populating  users details present in chat
    fullMessage = await User.populate(fullMessage, {
      path: "chat.users",
      select: "name email",
    });
    // updating latestMessage to current message for provided chatId
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: fullMessage,
    });
    return fullMessage;
  }
  // throwing error if message is not created properly
  throw new ApiError(
    httpStatus.INTERNAL_SERVER_ERROR,
    "failed to send the message please try again"
  );
};
/**
 * returns an object that contains the message details for the provided chatId
 * @param {string} chatId
 * @returns {Object}
 */
const getMessages = async (chatId) => {
  try {
    // getting all messages for particular chat
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("chat");
    return messages;
  } catch (err) {
    // throwing error incase of unable ot fetch messages
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch messages currently");
  }
};

module.exports = {
  createMessage,
  getMessages,
};
