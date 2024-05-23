const User = require("../schema/user.schema");
const { error } = require("../utils");

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? user : false;
};

const userExist = async (email) => {
  const user = await findUserByEmail(email);
  return user ? true : false;
};

const createUser = async ({ name, email, password }) => {
  if (!name || !email || !password)
    throw error.badRequest("Invalid parameters");

  const user = new User({ name, email, password });
  await user.save();

  return { ...user._doc, id: user.id };
};

module.exports = {
  userExist,
  findUserByEmail,
  createUser,
};
