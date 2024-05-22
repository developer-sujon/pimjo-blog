const { Schema, model } = require("mongoose");
const { MAX_STRING_NAME, MIN_STRING_NAME } = require("../config/validation");

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: MAX_STRING_NAME,
      maxLength: MIN_STRING_NAME,
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
  { timestamps: true, id: true, versionKey: false }
);

const User = model("User", userSchema);
module.exports = User;
