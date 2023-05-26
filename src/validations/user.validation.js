const Joi = require("joi");
const { objectId } = require("./custom.validation");

// checking userId  passed is string and valid mongo id
const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId, "custom validation").required(),
  }),
};

module.exports = {
  getUser,
};
