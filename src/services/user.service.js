const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * returns an object that contains the user details for the provided userId
 * @param {string} id
 * @returns {Object}
 */
const getUserById = async (id) => {
  const result = await User.findById(id);
  return result;
};

/**
 * returns an object that contains the user details for the provided email
 * @param {string} email
 * @returns {Object}
 */
const getUserByEmail = async (email) => {
  const result = await User.findOne({ email: email });
  return result;
};

/**
 * if user with email exists seneding user details or creating new user with user details
 * @param {Object} user
 * @returns {Object}
 */
const login = async (user) => {
  const {email} = user;
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return existingUser;
  }else{
    const result = await User.create(user);
    return result;
  }
};

/**
 * returns an array of objects that contains the user details by doing an case 
 * insensitive search in email or name field for given searchword and 
 * excluding current user 
 * @param {string} chatId
 * @returns {Object[]}
 */
const allUsers = async (searchedWord,user) => {
  const users = await User.find({
    $or:[
      {name:{$regex:searchedWord,$options:'i'}},
      {email:{$regex:searchedWord,$options:'i'}}
    ]
  }).find({email:{$ne:user.email}});
  if(searchedWord && users.length>0){
    return users;
  }else{
    return [];
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
  login,
  allUsers,
};
