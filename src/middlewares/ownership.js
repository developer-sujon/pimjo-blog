const { error } = require("../utils");
const { articleService, commentService } = require("../services");
const { DATABASE_CONSTANTS } = require("../constant");

const ownership =
  (model = "") =>
  async (req, res, next) => {
    try {
      if (model === DATABASE_CONSTANTS.ARTICLE) {
        const isOwner = await articleService.checkOwnership({
          resourceId: req.params.id,
          userId: req.user.id,
        });

        if (isOwner) {
          return next();
        }
        return next(error.authorizationError());
      } else if (model === DATABASE_CONSTANTS.COMMENT) {
        const isOwner = await commentService.checkOwnership({
          resourceId: req.params.id,
          userId: req.user.id,
        });

        if (isOwner) {
          return next();
        }
        return next(error.authorizationError());
      }
    } catch (err) {
      return next(err);
    }
  };

module.exports = ownership;
