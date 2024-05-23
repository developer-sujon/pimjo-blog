const tokenService = require("../services/token.service");
const userService = require("../services/user.service");
const { error } = require("../utils");

const authenticate = async (req, _res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = tokenService.verifyToken({ token });
    const user = await userService.findUserByEmail(decoded.email);

    if (!user) {
      next(error.authenticationError());
    }

    req.user = { ...user._doc, id: user.id };
    next();
  } catch (e) {
    next(error.authenticationError());
  }
};

module.exports = authenticate;
