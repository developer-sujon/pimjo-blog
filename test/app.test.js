require("dotenv").config();
const supertest = require("supertest");
const app = require("../src/app");

module.exports.TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTE2YTcxYjM2OTY4Njc3NTA0MjdmMyIsIm5hbWUiOiJNb2hhbWFtZCBTdWpvbiIsImVtYWlsIjoibXVoYW1tYWQuc3Vqb24uY3NlQGdtYWlsLmNvbSIsImlhdCI6MTcxNjYxMTkxMCwiZXhwIjoxNzQ4MTQ3OTEwfQ.B56dcHu2sHOfowSk9BmfiIXtyCk5BzxdDqv9WQgryeU`;

beforeAll(async () => {
  // await connectDB(process.env.TEST_DB_NAME);
});

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
