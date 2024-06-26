const { error } = require("../utils");
const jwt = require("jsonwebtoken");

const generateToken = ({
  payload,
  algorithm = "HS256",
  secret = process.env.ACCESS_TOKEN_SECRET,
  expiresIn = "365d", //TODO: testing purpose 365d
}) => {
  try {
    return jwt.sign(payload, secret, {
      algorithm,
      expiresIn,
    });
  } catch (e) {
    console.log("[JWT]", e);
    throw error.serverError();
  }
};

const decodeToken = ({ token, algorithm = "HS256" }) => {
  try {
    return jwt.decode(token, { algorithms: [algorithm] });
  } catch (e) {
    console.log("[JWT]", e);
    throw error.serverError();
  }
};

const verifyToken = ({
  token,
  algorithm = "HS256",
  secret = process.env.ACCESS_TOKEN_SECRET,
}) => {
  try {
    return jwt.verify(token, secret, { algorithms: [algorithm] });
  } catch (e) {
    console.log("[JWT]", e);
    throw error.serverError();
  }
};

module.exports = {
  generateToken,
  decodeToken,
  verifyToken,
};
