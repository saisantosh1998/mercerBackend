const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { messageService, userService } = require("../services");

// controller layer for creating message 
// sends 200 response on succesfull creation
const createMessage = catchAsync(async (req, res) => {
  const { email } = req.user;
  // to get the user details of logined user 
  const user = await userService.getUserByEmail(email);
  const message = await messageService.createMessage(user._id, req.body);
  res.status(httpStatus.OK).json(message);
});

// controller layer for gettign all mesages for particular chat
// sends 200 response on succesfull creation
const getMessages = catchAsync(async (req, res) => {
  const { chatId } = req.params;
  const message = await messageService.getMessages(chatId);
  res.status(httpStatus.OK).json(message);
});

module.exports = {
  createMessage,
  getMessages,
};
