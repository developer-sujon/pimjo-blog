const { commentService } = require("../services");

const create = async (req, res, next) => {
  const { description } = req.body;

  try {
    const comment = await commentService.create({
      description,
      authorId: req.user.id,
      articleId: req.params.id,
    });

    const response = {
      code: 201,
      message: "Comment Created Successfully",
      data: comment,
      links: {
        self: `/comments/${comment.id}`,
      },
    };

    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

const updateItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    const comment = await commentService.update(id, {
      description: req.body.description,
    });

    const response = {
      code: 200,
      message: "Comment updated successfully",
      data: comment,
    };

    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const removeItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    await commentService.removeItem(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  create,
  updateItem,
  removeItem,
};
