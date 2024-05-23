const { defaultsConfig } = require("../config");
const { Article } = require("../schema");
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
  return {
    ...article._doc,
    id: article.id,
  };
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

  return articles.map((article) => ({
    ...article._doc,
    id: article.id,
  }));
};

/**
 * Find a single article
 * @param {*} param0
 * @returns
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

  if (expand.includes("comment")) {
    await article.populate({
      path: "comments",
      strictPopulate: false,
    });
  }

  return {
    ...article._doc,
    id: article.id,
  };
};

module.exports = {
  create,
  count,
  findAllItems,
  findSingleItem,
};
