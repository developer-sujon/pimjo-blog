const { error } = require("../utils");

const isValidId = (req, _res, next) => {
  if (!req.params.id) {
    throw next(error.badRequest());
  }

  var mongoValidIdReg = /^[0-9a-fA-F]{24}$/;

  if (req.params.id.match(mongoValidIdReg)) {
    next();
  } else {
    throw next(error.badRequest("invalid params id"));
  }
};

module.exports = {
  isValidId,
};
