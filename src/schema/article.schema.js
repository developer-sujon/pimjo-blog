const { Schema, model } = require("mongoose");
const { DATABASE_CONSTANTS } = require("../constant");
const {
  MIN_TEXT_NAME,
  MAX_TEXT_NAME,
  MIN_STRING_NAME,
  MAX_STRING_NAME,
} = require("../config/validation");

const articleSchema = new Schema(
  {
    authorId: {
      type: Schema.ObjectId,
      required: true,
      ref: DATABASE_CONSTANTS.USER,
    },
    title: {
      type: String,
      minLength: MIN_STRING_NAME,
      maxLength: MAX_STRING_NAME,
      required: true,
    },
    description: {
      type: String,
      minLength: MIN_TEXT_NAME,
      maxLength: MAX_TEXT_NAME,
      required: true,
    },
  },
  { timestamps: true, id: true, versionKey: false }
);

const Article = model(DATABASE_CONSTANTS.ARTICLE, articleSchema);
module.exports = Article;
