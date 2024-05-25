const { defaultsConfig } = require("../config");
const { error } = require("../utils");
const prisma = require("../prisma");

/**
 * Create a new article
 * @param {*} param0
 * @returns Promise<Article>
 */
const create = async ({ title, description, authorId }) => {
  if (!title || !authorId) throw badRequest("Invalid parameters");
  return await prisma.article.create({
    data: {
      title,
      description,
      authorId,
    },
  });
};

/**
 * Count all article
 * @param {*} param0
 * @returns Promise<Number>
 */
const count = ({ search = "" }) => {
  const filter = {
    title: {
      contains: search,
      mode: "insensitive",
    },
  };

  return prisma.article.count({ where: filter });
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
  const filter = {
    title: {
      contains: search,
      mode: "insensitive",
    },
  };

  // Construct the orderBy object
  const orderBy = {
    [sortBy]: sortType,
  };

  const articles = await prisma.article.findMany({
    where: filter,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

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

  let include = {};

  if (expand.includes("author")) {
    include.author = {
      select: {
        name: true,
      },
    };
  }

  if (expand.includes("comments")) {
    include.comments = {
      select: {
        description: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    };
  }

  const article = await prisma.article.findUnique({
    where: {
      id,
    },
    include,
  });

  if (!article) {
    throw error.notFound();
  }

  return article;
};

/**
 * Update or create article
 * @param {*} param0
 * @returns Promise<Article>
 */

const updateOrCreate = async (id, { title, description, authorId }) => {
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) {
    const article = await create({ title, description, authorId });
    return {
      article,
      code: 201,
    };
  }

  const updatedArticle = await prisma.article.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      authorId,
    },
  });

  return { article: updatedArticle, code: 200 };
};

/**
 * Delete a article
 * @param {*} param0
 * @returns Promise<Article>
 */
const removeItem = async (id) => {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw error.notFound();
  }

  return prisma.article.delete({ where: { id } });
};

const checkOwnership = async ({ resourceId, userId }) => {
  const article = await prisma.article.findUnique({
    where: { id: resourceId },
  });
  if (!article) throw error.notFound();

  if (article.authorId === userId) {
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
