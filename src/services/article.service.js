const mongoose = require("mongoose");
const { defaultsConfig } = require("../config");
const { Article, Comment } = require("../schema");
const { error } = require("../utils");

/**
 * Create a new article
 * @param {*} param0
 * @returns Promise<Article>
 */
const create = async ({ title, description, author }) => {
  if (!title || !author) throw badRequest("Invalid parameters");

  const article = new Article({
    title,
    description,
    author,
  });

  await article.save();
  return article.toJSON();
};

/**
 * Count all article
 * @param {*} param0
 * @returns Promise<Number>
 */
const count = ({ search = "" }) => {
  const filter = {
    title: { $regex: search, $options: "i" },
  };

  return Article.countDocuments(filter);
};

/**
 * Find all articles
 * Pagination
 * Searching
 * Sorting
 * @param{*} param0
 * @returns Promise<Article[]>
 */
const findAllItems = async ({
  page = defaultsConfig.page,
  limit = defaultsConfig.limit,
  sortType = defaultsConfig.sortType,
  sortBy = defaultsConfig.sortBy,
  search = defaultsConfig.search,
}) => {
  const sortStr = `${sortType === "dsc" ? "-" : ""}${sortBy}`;
  const filter = {
    title: { $regex: search, $options: "i" },
  };

  const articles = await Article.find(filter)
    .populate({ path: "author", select: "name" })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return articles;
};

/**
 * Find a single article
 * @param {*} param0
 * @returns Promise<Article>
 */
const findSingleItem = async ({ id, expand = "" }) => {
  if (!id) throw new Error("Id is required");

  expand = expand.split(",").map((item) => item.trim());

  const article = await Article.findById(id);
  if (!article) {
    throw error.notFound();
  }

  if (expand.includes("author")) {
    await article.populate({
      path: "author",
      select: "name",
      strictPopulate: false,
    });
  }

  if (expand.includes("comments")) {
    await article.populate({
      path: "comments",
      select: "description author",
      strictPopulate: false,
      populate: {
        path: "author",
        select: "name",
      },
    });
  }
  return article.toJSON();
};

/**
 * Update or create article
 * @param {*} param0
 * @returns Promise<Article>
 */

const updateOrCreate = async (id, { title, description, author }) => {
  const article = await Article.findById(id);

  if (!article) {
    const article = await create({ title, description, author: author.id });
    return {
      article: article.toJSON(),
      code: 201,
    };
  }

  const payload = {
    title,
    description,
    author: author.id,
  };

  article.overwrite(payload);
  await article.save();

  return { article: article.toJSON(), code: 200 };
};

/**
 * Delete a article
 * @param {*} param0
 * @returns Promise<Article>
 */
const removeItem = async (id) => {
  const session = await mongoose.startSession(); // for starting a new session

  try {
    session.startTransaction(); // for starting a new transaction

    const article = await Article.findById(id);
    if (!article) {
      throw error.notFound();
    }

    // Asynchronously Delete all associated comments
    await Comment.deleteMany({ article: id }, { session });
    await Article.findByIdAndDelete(id, { session });

    await session.commitTransaction(); // for committing all operations
    return article.toJSON();
  } catch (e) {
    await session.abortTransaction(); // for rollback the operations
    throw e;
  } finally {
    session.endSession();
  }
};

const checkOwnership = async ({ resourceId, userId }) => {
  const article = await Article.findById(resourceId);
  if (!article) throw error.notFound();

  if (article._doc.author.toString() === userId) {
    return true;
  }
  return false;
};

module.exports = {
  create,
  count,
  findAllItems,
  findSingleItem,
  updateOrCreate,
  removeItem,
  checkOwnership,
};
