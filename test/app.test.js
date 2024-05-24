require("dotenv").config();
const supertest = require("supertest");
const app = require("../src/app");
const connectDB = require("../src/database/connectDB");

module.exports.TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTBmY2M3MWRmODVjOTc4NzU5ZmZlNCIsIm5hbWUiOiJNb2hhbWFtZCBTdWpvbiIsImVtYWlsIjoibXVoYW1tYWQuc3Vqb24uY3NlQGdtYWlsLmNvbSIsImlhdCI6MTcxNjU4MzYyOCwiZXhwIjoxNzE2NTg3MjI4fQ.mV6xJJnieJQqdCozn7mcW8-HBZBEeTf5_S6jqJwjHQ8`;

beforeAll(async () => {
  await connectDB(process.env.TEST_DB_NAME);
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
