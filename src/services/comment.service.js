const { default: mongoose } = require("mongoose");
const { Comment, Article } = require("../schema");
const { error } = require("../utils");
const prisma = require("../prisma");

/**
 * Create a new comment
 * @param {*} param0
 * @returns Promise<Comment>
 */
const create = async ({ description, authorId, articleId }) => {
  if (!description || !authorId || !articleId)
    throw badRequest("Invalid parameters");

  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });
  if (!article) {
    throw error.notFound("Article not found");
  }
};

/**
 * Update a comment
 * @param {*} param0
 * @returns Promise<Comment>
 */

const update = async (id, { description }) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    throw error.notFound();
  }

  comment.description = description;
  return await comment.save();
};

/**
 * Delete a comment
 * @param {*} param0
 * @returns Promise<Comment>
 */
const removeItem = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // for starting a new transaction

    const comment = await Comment.findById(id);
    if (!comment) {
      throw error.notFound();
    }

    // Asynchronously remove article associated comments
    const article = await Article.findOne(comment.article);
    if (!article) {
      throw error.notFound("Article not found");
    }

    article.comments = article.comments.filter(
      (commentId) => commentId.toString() !== id
    );

    await article.save({ session });
    await Comment.findByIdAndDelete(id, { session });

    await session.commitTransaction(); // for committing all operations
    return comment.toJSON();
  } catch (e) {
    await session.abortTransaction(); // for rollback the operations
    throw e;
  } finally {
    session.endSession();
  }
};

const checkOwnership = async ({ resourceId, userId }) => {
  const comment = await Comment.findById(resourceId);
  if (!comment) throw error.notFound();

  if (comment._doc.author.toString() === userId) {
    return true;
  }
  return false;
};

module.exports = {
  create,
  update,
  removeItem,
  checkOwnership,
};
