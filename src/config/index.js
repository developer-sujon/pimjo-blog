const {
  MIN_STRING_NAME,
  MAX_STRING_NAME,
  MIN_TEXT_NAME,
  MAX_TEXT_NAME,
} = require("./validation");
const { allCommentStatus, commentStatus } = require("./comment.enum");

module.exports = {
  validationConfig,
  allCommentStatus,
  commentStatus,
};
