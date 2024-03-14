const INVALID_DATA_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const DEFAULT_ERROR = 500;
// Define SUCCESS
const SUCCESS = 200;

module.exports = {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  SUCCESS,
};

// https://mongoosejs.com/docs/api/error.html

// class ValidationError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = "ValidationError";
//     this.statusCode = 400;
//   }
// }
