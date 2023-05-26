//  helper Error class that inherits from basic Error class and 
//  forms an proper error object
class ApiError extends Error {
  constructor(code, message, isOperational = true, stack = "") {
    super(message);
    this.code = code;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
