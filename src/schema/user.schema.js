const { Schema, model } = require("mongoose");
const { validationConfig } = require("../config");
const { schemaOption } = require("../database");
const toJson = require("@meanie/mongoose-to-json");

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

// add plugin that converts mongoose to json
userSchema.plugin(toJson);

const User = model("User", userSchema);
module.exports = User;
