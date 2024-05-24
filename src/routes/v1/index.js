const { DATABASE_CONSTANTS } = require("../../constant");
const { DATABASE_CONNECTION } = require("../../constant/database.constants");
const {
  authController,
  articleController,
  commentController,
} = require("../../controllers");
const { authenticate, ownership } = require("../../middlewares");
const { isValidId } = require("../../middlewares/isValidMongoId");

const router = require("express").Router();

// Auth routes
router
  .post("/api/v1/auth/signup", authController.register)
  .post("/api/v1/auth/signin", authController.login);

// Article routes
router
  .route("/api/v1/articles")
  .get(articleController.findAllItems)
  .post(authenticate, articleController.create);

router
  .route("/api/v1/articles/:id")
  .get(isValidId, articleController.findSingleItem)
  .patch(
    isValidId,
    authenticate,
    ownership(DATABASE_CONSTANTS.ARTICLE),
    articleController.updateItem
  )
  .delete(
    isValidId,
    authenticate,
    ownership(DATABASE_CONSTANTS.ARTICLE),
    articleController.removeItem
  );
//ownership("Article"),

// Comment routes
router
  .route("/api/v1/comments/:id")
  .post(isValidId, authenticate, commentController.create)
  .patch(
    isValidId,
    authenticate,
    ownership(DATABASE_CONSTANTS.COMMENT),
    commentController.updateItem
  )
  .delete(
    isValidId,
    authenticate,
    ownership(DATABASE_CONSTANTS.COMMENT),
    commentController.removeItem
  );

module.exports = router;
