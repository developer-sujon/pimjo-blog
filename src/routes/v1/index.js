const {
  authController,
  articleController,
  commentController,
} = require("../../controllers");
const { authenticate } = require("../../middlewares");

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
  .get(articleController.findSingleItem)
  .patch(authenticate, articleController.updateItem)
  .delete(authenticate, articleController.removeItem);
//ownership("Article"),

// Comment routes
router
  .route("/api/v1/comments/:id")
  .post(authenticate, commentController.create)
  .patch(authenticate, commentController.updateItem)
  .delete(authenticate, commentController.removeItem);

module.exports = router;
