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

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw error.notFound("Article not found");
  }

  return prisma.comment.create({ data: { description, authorId, articleId } });
};

/**
 * Update a comment
 * @param {*} param0
 * @returns Promise<Comment>
 */

const update = async (id, { description }) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: id,
    },
    data: {
      description: description,
    },
  });

  return updatedComment;
};

/**
 * Delete a comment
 * @param {*} param0
 * @returns Promise<Comment>
 */
const removeItem = async (id) => {
  const comment = await prisma.comment.delete({ where: { id } });
  if (!comment) {
    throw error.notFound();
  }

  return comment;
};

const checkOwnership = async ({ resourceId, userId }) => {
  const comment = await prisma.comment.findUnique({
    where: { id: resourceId },
  });
  if (!comment) throw error.notFound();

  if (comment.authorId === userId) {
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
