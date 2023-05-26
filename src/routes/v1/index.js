const express = require("express");
const userRoute = require("./user.route");
const chatRoute = require("./chat.route");
const messageRoute = require("./message.route");





const router = express.Router();

router.use('/user',userRoute);
router.use('/chat',chatRoute);
router.use('/message',messageRoute);







module.exports = router;
