// regex for checking a valid mongo id
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

// throwing position of string in array which is not  valid mongo
const users = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message(
      "users{{#label}} must be a valid mongo id".replace('"', "")
    );
  }
  return value;
};

module.exports = {
  objectId,
  users,
};
