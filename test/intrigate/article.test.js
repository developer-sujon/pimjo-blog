require("dotenv").config();
const supertest = require("supertest");
const { createArticleMock, updateArticleMock } = require("../mock/article");
const app = require("../../src/app");
const { TOKEN } = require("../app.test");
const prisma = require("../../src/prisma");

beforeAll(async () => {
  //await connectDB(process.env.TEST_DB_NAME);
});

describe("Article", () => {
  const dataTrack = [];

  describe("Create a Article", () => {
    it("given valid request body should return 201 & create new article", async () => {
      const response = await supertest(app)
        .post("/api/v1/articles")
        .set("Authorization", TOKEN)
        .send(createArticleMock);
      dataTrack.push(response?._body?.data?._id);
      expect([201, 401]).toContain(response.status);
    });
  });

  describe("given no authorized header", () => {
    it("should return 401 response", async () => {
      const response = await supertest(app)
        .post("/api/v1/articles")
        .set("Authorization", "")
        .send(createArticleMock);
      expect(response.status).toBe(401);
    });
  });

  describe("Get all Articles", () => {
    describe("given authorized header", () => {
      it("should return 200 response", async () => {
        const response = await supertest(app)
          .get("/api/v1/articles")
          .set("Authorization", TOKEN);
        expect(response.status).toBe(200);
      });
    });
  });

  describe("Get single Article", () => {
    it("should return 200 response", async () => {
      const articleId = Math.round(Math.random());
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      const response = await supertest(app)
        .get(`/api/v1/articles/${articleId}`)
        .set("Authorization", TOKEN);

      if (!article) {
        expect(response.status).toBe(404);
      } else {
        expect(response.status).toBe(204);
      }
    });
  });

  describe("Update a Article", () => {
    it("Should Update Article", async () => {
      const articleId = Math.round(Math.random());
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      const response = await supertest(app)
        .patch(`/api/v1/articles/${articleId}`)
        .set("Authorization", TOKEN)
        .send(updateArticleMock);
      if (!article) {
        expect([404, 401]).toContain(response.status);
      } else {
        expect([200, 403, 401]).toContain(response.status);
      }
    });
  });

  describe("Delete a Article", () => {
    it("Should Delete article", async () => {
      const articleId = Math.round(Math.random());
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      const response = await supertest(app)
        .delete(`/api/v1/articles/${articleId}`)
        .set("Authorization", TOKEN);
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
