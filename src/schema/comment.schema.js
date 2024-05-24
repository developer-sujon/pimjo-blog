const { Schema, model } = require("mongoose");
const { commentStatus, allCommentStatus } = require("../constant");
const { DATABASE_CONSTANTS } = require("../constant");
const { validationConfig } = require("../config");
const { schemaOption } = require("../database");
const toJson = require("@meanie/mongoose-to-json");

const commentSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      required: true,
      ref: DATABASE_CONSTANTS.USER,
    },
    article: {
      type: Schema.ObjectId,
      required: true,
      ref: DATABASE_CONSTANTS.ARTICLE,
    },
    description: {
      type: String,
      minLength: validationConfig.MIN_TEXT_NAME,
      maxLength: validationConfig.MAX_TEXT_NAME,
      required: true,
    },
    status: {
      type: String,
      enum: commentStatus,
      default: allCommentStatus.PUBLIC,
    },
  },
  schemaOption
);

// add plugin that converts mongoose to json
commentSchema.plugin(toJson);

const Comment = model(DATABASE_CONSTANTS.COMMENT, commentSchema);
module.exports = Comment;
