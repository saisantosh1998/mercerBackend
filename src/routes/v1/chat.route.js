const express = require("express");
const validate = require("../../middlewares/validate");
const { verifyUser } = require('../../middlewares/auth');
const chatValidation = require("../../validations/chat.validation");
const chatController = require("../../controllers/chat.controller");

const router = express.Router();

// route for getting all chats for loginned user
router.get(
  `/`,
  verifyUser,
  chatController.getChats
);

// route for getting all groups for joining one of them
router.get(
  `/allGroups`,
  verifyUser,
  chatController.getGroups
);

// route for creating a single chat betwen two users
router.post(
  "/",
  verifyUser,
  validate(chatValidation.createChat),
  chatController.createChat
);

// route for creating a group chat for bunch of users
router.post(
  "/group",
  verifyUser,
  validate(chatValidation.createGroupChat),
  chatController.createGroupChat
);

// route for renaming the group name
router.put(
  "/:groupId/rename",
  verifyUser,
  validate(chatValidation.renameGroupChat),
  chatController.renameGroupChat
);

// route for removing an user from group 
router.put(
  "/:groupId/remove",
  verifyUser,
  validate(chatValidation.removeUser),
  chatController.removeUser
);

// route for adding user in the group
router.put(
  "/:groupId/add",
  verifyUser,
  validate(chatValidation.addUser),
  chatController.addUser
);

module.exports = router;
