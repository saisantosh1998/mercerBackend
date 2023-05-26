const { jwtDecode } = require("jwt-decode");
// const admin = require("../config/firebase-config");
const httpStatus = require("http-status");

// using the firebase config and validating token provided ias valid or not 
// send back user details to the routes
const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
      // const decodeToken = await admin.auth().verifyIdToken(token);
      const decodeToken=jwtDecode(token);
      if (decodeToken) {
        req.user = {
          email: decodeToken.email,
          name: decodeToken.name,
        };
        return next();
    } 
    return res
      .status(httpStatus.FORBIDDEN)
      .json({ message: "Unauthorized token provided" });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Some error occured while authentication", error });
  }
};

module.exports = {
  verifyUser,
};
