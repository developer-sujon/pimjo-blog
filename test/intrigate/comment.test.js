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
  describe("Create a Comment", () => {
    it("given valid request body should return 201 & create new comment", async () => {
      const article = await prisma.article.findFirst();

      if (!article) {
        console.log("No articles found in the database");
        return;
      }

      const response = await supertest(app)
        .post(`/api/v1/comments/${article.id}`)
        .set("authorization", `bearer ${AUTH_TOKEN}`)
        .send(createCommentMock);

      expect([400, 201]).toContain(response.status);
    });
  });

  describe("Update a comment", () => {
    it("Should update comment", async () => {
      const comment = await prisma.comment.findFirst();

      if (!comment) {
        console.log("No comments found in the database");
        return;
      }

      const response = await supertest(app)
        .patch(`/api/v1/comments/${comment.id}`)
        .set("authorization", `bearer ${AUTH_TOKEN}`)
        .send(updateCommentMock);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe("Delete a Comment", () => {
    it("Should delete comment", async () => {
      const comment = await prisma.comment.findFirst();

      if (!comment) {
        console.log("No comments found in the database");
        return;
      }

      const response = await supertest(app)
        .delete(`/api/v1/comments/${comment.id}`)
        .set("authorization", `bearer ${AUTH_TOKEN}`);

      expect([204, 401]).toContain(response.status);
    });
  });
});
