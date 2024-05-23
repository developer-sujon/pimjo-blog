const tokenService = require("./token.service");
const userService = require("./user.service");
const { error, hashing } = require("../utils");

const register = async ({ name, email, password }) => {
  const hasUser = await userService.userExist(email);

  if (hasUser) {
    throw error.badRequest("User already exist");
  }

  password = await hashing.generateHash(password);
  const user = await userService.createUser({ name, email, password });

  return user;
};

const login = async ({ email, password }) => {
  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw error.badRequest("Invalid Credentials");
  }

  const matched = await hashing.hashMatched(password, user.password);
  if (!matched) {
    throw error.badRequest("Invalid Credentials");
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return tokenService.generateToken({ payload });
};

module.exports = {
  register,
  login,
};
