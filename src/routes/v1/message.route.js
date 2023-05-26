const express = require("express");
const validate = require("../../middlewares/validate");
const { verifyUser } = require('../../middlewares/auth');
const messageValidation = require("../../validations/message.validation");
const messageController = require("../../controllers/message.controller");

const router = express.Router();

// router for getting specfic chat details
router.get(
  `/:chatId`,
  verifyUser,
  validate(messageValidation.getMessages),
  messageController.getMessages
);

// route for creating a message
router.post(
  "/",
  verifyUser,
  validate(messageValidation.createMessage),
  messageController.createMessage
);



module.exports = router;
