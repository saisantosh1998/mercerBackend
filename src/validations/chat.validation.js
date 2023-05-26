const Joi = require("joi");
const { objectId, users } = require("./custom.validation");
// checking userId  passed is string and valid mongo id
const createChat = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId, "custom validation").required(),
  }),
};
// checking users array passed are strings and valid mongo ids and groupName is string
const createGroupChat = {
  body: Joi.object().keys({
    users: Joi.array()
      .items(Joi.string().custom(users, "custom validation").required())
      .required(),
    groupName: Joi.string().required(),
  }),
};
// checking groupId  passed is string and valid mongo id and groupName is string
const renameGroupChat = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId, "custom validation").required(),
  }),
  body: Joi.object().keys({
    groupName: Joi.string().required(),
  }),
};
// checking groupId  and userId passed are strings and valid mongo ids
const removeUser = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId, "custom validation").required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId, "custom validation").required(),
  }),
};

// checking groupId  and userId passed are strings and valid mongo ids
const addUser = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId, "custom validation").required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId, "custom validation").required(),
  }),
};
module.exports = {
  createChat,
  createGroupChat,
  renameGroupChat,
  removeUser,
  addUser,
};
