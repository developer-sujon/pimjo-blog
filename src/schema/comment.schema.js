const { Schema, model } = require("mongoose");
const { commentStatus, allCommentStatus } = require("../config");
const { DATABASE_CONSTANTS } = require("../constant");
const { MIN_TEXT_NAME, MAX_TEXT_NAME } = require("../config/validation");

const commentSchema = new Schema(
  {
    authorId: {
      type: Schema.ObjectId,
      required: true,
      ref: DATABASE_CONSTANTS.USER,
    },
    articleId: {
      type: Schema.ObjectId,
      required: true,
      ref: DATABASE_CONSTANTS.ARTICLE,
    },
    description: {
      type: String,
      minLength: MIN_TEXT_NAME,
      maxLength: MAX_TEXT_NAME,
      required: true,
    },
    status: {
      type: String,
      enum: commentStatus,
      default: allCommentStatus.PUBLIC,
    },
  },
  { timestamps: true, id: true, versionKey: false }
);

const Comment = model(DATABASE_CONSTANTS.COMMENT, commentSchema);
module.exports = Comment;
