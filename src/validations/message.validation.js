const Joi = require("joi");
const { objectId, users } = require("./custom.validation");

// checking chatId  passed is string and valid mongo id and content is string
const createMessage = {
  body: Joi.object().keys({
    content: Joi.string().required(),
    chatId: Joi.string().custom(objectId, "custom validation").required(),
  }),
};
// checking chatId  passed is string and valid mongo id
const getMessages = {
  params: Joi.object().keys({
    chatId: Joi.string().custom(objectId, "custom validation").required(),
  }),
};

module.exports = {
  createMessage,
  getMessages,
};
