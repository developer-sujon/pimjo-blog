const { Schema, model } = require("mongoose");
const { DATABASE_CONSTANTS } = require("../constant");
const { validationConfig } = require("../config");
const { schemaOption } = require("../database");
const toJson = require("@meanie/mongoose-to-json");

const articleSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      required: true,
      ref: DATABASE_CONSTANTS.USER,
    },
    title: {
      type: String,
      minLength: validationConfig.MIN_STRING_NAME,
      maxLength: validationConfig.MAX_STRING_NAME,
      required: true,
    },
    description: {
      type: String,
      minLength: validationConfig.MIN_TEXT_NAME,
      maxLength: validationConfig.MAX_TEXT_NAME,
      required: true,
    },
    comments: [
      {
        type: Schema.ObjectId,
        ref: DATABASE_CONSTANTS.COMMENT,
      },
    ],
  },
  schemaOption
);

// add plugin that converts mongoose to json
articleSchema.plugin(toJson);

const Article = model(DATABASE_CONSTANTS.ARTICLE, articleSchema);
module.exports = Article;
