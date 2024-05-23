const { Schema, model } = require("mongoose");
const { validationConfig } = require("../config");
const { schemaOption } = require("../database");

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: validationConfig.MIN_STRING_NAME,
      maxLength: validationConfig.MAX_STRING_NAME,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  schemaOption
);

const User = model("User", userSchema);
module.exports = User;
