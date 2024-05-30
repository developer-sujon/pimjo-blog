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

require("./intrigate/auth.test");
require("./intrigate/article.test");
require("./intrigate/comment.test");
