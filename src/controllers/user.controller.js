const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

// controller layer for user details for particular user
// sends 200 response on succesfull creation
const getUser = catchAsync(async (req, res) => {
  const id = req.params.userId;
  let user = await userService.getUserById(id);
  if (user !== null) {
      // only loggined users get all full details of user not others
      if(req.user.email!==user.email)throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized access");
      res.status(httpStatus.OK).json(user);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found")
    }
});

// controller layer for signing purpose 
// sends 200 response on succesfull creation
const login = catchAsync(async (req, res) => {
  const user = await userService.login(req.user);
  res.status(httpStatus.OK).json(user);
});

// controller layer for gettigng all users in database
// sends 200 response on succesfull creation
const allUsers = catchAsync(async (req, res) => {
  const searchedWord = req.query.search;
  const users = await userService.allUsers(searchedWord,req.user);
  res.status(httpStatus.OK).json(users);
});
module.exports = {
  getUser,
  login,
  allUsers,
};
