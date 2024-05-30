require("dotenv").config();
const supertest = require("supertest");
const app = require("../src/app");

// Health Route Test
describe("GET /health", () => {
  it("check API is live on Server.", async () => {
    const response = await supertest(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      health: "OK",
    });
  });
});

const authTest = require("./intrigate/auth.test");
// const articleTest = require("./intrigate/article.test");
// const commentTest = require("./intrigate/comment.test");
