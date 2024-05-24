const { default: mongoose } = require("mongoose");
const { Comment, Article } = require("../schema");
const { error } = require("../utils");

/**
 * Create a new comment
 * @param {*} param0
 * @returns Promise<Comment>
 */
const create = async ({ description, authorId, articleId }) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // for starting a new transaction

    if (!description || !authorId || !articleId)
      throw badRequest("Invalid parameters");

    const article = await Article.findById(articleId);
    if (!article) {
      throw error.notFound("Article not found");
    }

    const comment = new Comment({
      description,
      author: authorId,
      article: articleId,
    });

    // Asynchronously update a article comments
    article.comments.push(comment.id);

    await article.save({ session });
    await comment.save({ session });
    return comment.toJSON();
  } catch (e) {
    await session.abortTransaction(); // for rollback the operations
    throw e;
  } finally {
    session.endSession();
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

    article.save({ session });
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

module.exports = {
  create,
  update,
  removeItem,
};
