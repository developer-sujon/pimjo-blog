require("dotenv").config();
const supertest = require("supertest");
const { connectDB } = require("../../src/database");
const app = require("../../src/app");
const { TOKEN } = require("../app.test");
const { default: mongoose } = require("mongoose");
const { createCommentMock, updateCommentMock } = require("../mock/comment");
const { Comment, Article } = require("../../src/schema");

beforeAll(async () => {
  await connectDB(process.env.TEST_DB_NAME);
});

describe("Comment", () => {
  const dataTrack = [];

  describe("Create a Comment", () => {
    it("given valid request body should return 201 & create new comment", async () => {
      const article = await Article.findOne();

      const response = await supertest(app)
        .post(`/api/v1/comments/${article.id}`)
        .set("Authorization", TOKEN)
        .send(createCommentMock);
      dataTrack.push(response?._body?.data?._id);
      expect(response.status).toBe(201);
    });
  });

  describe("Update a comment", () => {
    it("Should Update comment", async () => {
      const commentId = new mongoose.Types.ObjectId().toString();
      const comment = await Comment.findById(commentId);
      const response = await supertest(app)
        .patch(`/api/v1/comments/${commentId}`)
        .set("Authorization", TOKEN)
        .send(updateCommentMock);
      if (!comment) {
        expect(response.status).toBe(404);
      } else {
        expect(response.status).toBe(200);
      }
    });
  });

  describe("Delete a Article", () => {
    it("Should Delete article", async () => {
      const commentId = new mongoose.Types.ObjectId().toString();
      const comment = await Comment.findById(commentId);
      const response = await supertest(app)
        .delete(`/api/v1/comments/${commentId}`)
        .set("Authorization", TOKEN);
      if (!comment) {
        expect(response.status).toBe(404);
      } else {
        expect(response.status).toBe(204);
      }
    });
  });

  afterEach(async () => {
    dataTrack.forEach(async (itemId) => {
      await Comment.findByIdAndDelete(itemId);
    });
  });
});
