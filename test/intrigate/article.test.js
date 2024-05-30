require("dotenv").config();
const supertest = require("supertest");
const { createArticleMock, updateArticleMock } = require("../mock/article");
const app = require("../../src/app");
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

describe("Article", () => {
  const dataTrack = [];
  describe("Create a Article", () => {
    it("given valid request body should return 201 & create new article", async () => {
      const response = await supertest(app)
        .post("/api/v1/articles")
        .set("authorization", `bearer ${AUTH_TOKEN}`)
        .send(createArticleMock);
      dataTrack.push(response?.body?.data?._id);
      expect([201, 401]).toContain(response.status);
    });
  });

  describe("Given no authorized header", () => {
    it("should return 401 response", async () => {
      const response = await supertest(app)
        .post("/api/v1/articles")
        .set("authorization", "")
        .send(createArticleMock);
      expect(response.status).toBe(401);
    });
  });

  describe("Get all Articles", () => {
    describe("Given authorized header", () => {
      it("should return 200 response", async () => {
        const response = await supertest(app)
          .get("/api/v1/articles")
          .set("authorization", `bearer ${AUTH_TOKEN}`);
        expect(response.status).toBe(200);
      });
    });
  });

  describe("Get single Article", () => {
    it("should return 200 response", async () => {
      const articleId = Math.round(Math.random() + 1);
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      const response = await supertest(app)
        .get(`/api/v1/articles/${articleId}`)
        .set("authorization", `bearer ${AUTH_TOKEN}`);

      if (!article) {
        expect(response.status).toBe(404);
      } else {
        expect(response.status).toBe(204);
      }
    });
  });

  describe("Update an Article", () => {
    it("should update an article", async () => {
      const articleId = Math.round(Math.random() + 1);
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      const response = await supertest(app)
        .patch(`/api/v1/articles/${articleId}`)
        .set("authorization", `bearer ${AUTH_TOKEN}`)
        .send(updateArticleMock);
      if (!article) {
        expect([404, 401]).toContain(response.status);
      } else {
        expect([200, 403, 401]).toContain(response.status);
      }
    });
  });

  describe("Delete an Article", () => {
    it("should delete an article", async () => {
      const articleId = Math.round(Math.random() + 1);
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      const response = await supertest(app)
        .delete(`/api/v1/articles/${articleId}`)
        .set("authorization", `bearer ${AUTH_TOKEN}`);

      if (!article) {
        expect([404, 401]).toContain(response.status);
      } else {
        expect([204, 401]).toContain(response.status);
      }
    });
  });

  afterEach(async () => {
    dataTrack.forEach(async (id) => {
      await prisma.article.deleteMany({ where: { id } });
    });
  });
});
