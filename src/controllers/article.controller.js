const { defaultsConfig } = require("../config");
const { articleService } = require("../services");
const { query } = require("../utils");

const create = async (req, res, next) => {
  const { title, description } = req.body;

  try {
    const article = await articleService.create({
      title,
      description,
      author: req.user.id,
    });

    delete article._id;

    const response = {
      code: 201,
      message: "Article Created Successfully",
      data: { ...article },
      links: {
        self: `/articles/${article.id}`,
        author: `/articles/${article.id}/author`,
        comments: `/articles/${article.id}/comments`,
      },
    };

    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

const findAllItems = async (req, res, next) => {
  const page = req.query.page || defaultsConfig.page;
  const limit = req.query.limit || defaultsConfig.limit;
  const sortType = req.query.sort_type || defaultsConfig.sortType;
  const sortBy = req.query.sort_by || defaultsConfig.sortBy;
  const search = req.query.search || defaultsConfig.search;

  try {
    // data
    const articles = await articleService.findAllItems({
      page,
      limit,
      sortType,
      sortBy,
      search,
    });

    const data = query.getTransformedItems({
      items: articles,
      selection: [
        "id",
        "title",
        "description",
        "author",
        "updatedAt",
        "createdAt",
      ],
      path: "/articles",
    });

    // pagination
    const totalItems = await articleService.count({ search });
    const pagination = query.getPagination({ totalItems, limit, page });

    // HATEOAS Links
    const links = query.getHATEOASForAllItems({
      url: req.url,
      path: req.path,
      query: req.query,
      hasNext: !!pagination.next,
      hasPrev: !!pagination.prev,
      page,
    });

    res.status(200).json({
      data,
      pagination,
      links,
    });
  } catch (e) {
    next(e);
  }
};

const findSingleItem = async (req, res, next) => {
  const id = req.params.id;
  const expand = req.query.expand || "";

  try {
    const article = await articleService.findSingleItem({ id, expand });
    const response = {
      data: article,
      links: {
        self: `/articles/${article.id}`,
        author: `/articles/${article.id}/author`,
        comments: `/articles/${article.id}/comments`,
      },
    };

    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  create,
  findAllItems,
  findSingleItem,
};
