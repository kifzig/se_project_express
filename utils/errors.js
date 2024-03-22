const INVALID_DATA_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const DEFAULT_ERROR = 500;
const SUCCESS = 200;
const UNAUTHORIZED = 401;
const BAD_REQUEST = 400;
const DUPLICATE_ERROR = 409;
const FORBIDDEN = 403;

module.exports = {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  SUCCESS,
  UNAUTHORIZED,
  BAD_REQUEST,
  DUPLICATE_ERROR,
  FORBIDDEN,
};

// https://mongoosejs.com/docs/api/error.html

// class ValidationError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = "ValidationError";
//     this.statusCode = 400;
//   }
// }
