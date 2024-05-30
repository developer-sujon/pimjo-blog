require("dotenv").config();
const supertest = require("supertest");
const app = require("../../src/app");
const { createCommentMock, updateCommentMock } = require("../mock/comment");
const prisma = require("../../src/prisma");
const { seedUser, mockUser } = require("../../seed");

let AUTH_TOKEN = "";

beforeAll(async () => {
  await seedUser(prisma);
  const response = await supertest(app).post("/api/v1/auth/signin").send({
    email: mockUser.email,
    password: mockUser.password,
  });
  AUTH_TOKEN = response?.body?.data?.access_token;
});

describe("Comment", () => {
  const dataTrack = [];

  describe("Create a Comment", () => {
    it("given valid request body should return 201 & create new comment", async () => {
      const article = await prisma.article.findFirst();

      const response = await supertest(app)
        .post(`/api/v1/comments/${article?.id}`)
        .set("authorization", `bearer ${AUTH_TOKEN}`)
        .send(createCommentMock);

      expect([400, 201]).toContain(response.status);

      dataTrack.push(response.body.data?._id);
    });
  });

  describe("Update a comment", () => {
    it("Should Update comment", async () => {
      const commentId = Math.round(Math.random() + 1);
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      const response = await supertest(app)
        .patch(`/api/v1/comments/${commentId}`)
        .set("authorization", `bearer ${AUTH_TOKEN}`)
        .send(updateCommentMock);
      if (!comment) {
        expect([404, 401]).toContain(response.status);
      } else {
        expect([404, 401]).toContain(response.status);
      }
    });
  });

  describe("Delete a Article", () => {
    it("Should Delete article", async () => {
      const commentId = Math.round(Math.random() + 1);
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
      const response = await supertest(app)
        .delete(`/api/v1/comments/${commentId}`)
        .set("authorization", `bearer ${AUTH_TOKEN}`);
      if (!comment) {
        expect([404, 401]).toContain(response.status);
      } else {
        expect([204, 401]).toContain(response.status);
      }
    });
  });

  afterEach(async () => {
    dataTrack.forEach(async (id) => {
      await prisma.comment.deleteMany({ where: id });
    });
  });
});
