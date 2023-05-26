const express = require("express");
const validate = require("../../middlewares/validate");
const { verifyUser } = require("../../middlewares/auth");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");

const router = express.Router();

// route for getting all existing users
router.get("/allUsers", verifyUser, userController.allUsers);

// route for getiign specific user details
router.get(
  `/:userId`,
  verifyUser,
  validate(userValidation.getUser),
  userController.getUser
);

// route for sign in to the website
router.post("/login", verifyUser, userController.login);


module.exports = router;
