require("dotenv").config();
const supertest = require("supertest");
const { connectDB } = require("../../src/database");
const app = require("../../src/app");
const { TOKEN } = require("../app.test");
const { default: mongoose } = require("mongoose");
const { createCommentMock, updateCommentMock } = require("../mock/comment");
const { Comment, Article, User } = require("../../src/schema");
const { registerUserMock, loginUserMock } = require("../mock/auth");

beforeAll(async () => {
  await connectDB(process.env.TEST_DB_NAME);
});

describe("Auth", () => {
  const dataTrack = [];

  describe("Create a new account", () => {
    it("given valid request body should return 201 & create new user", async () => {
      const user = await User.findOne({ email: registerUserMock.email });

      const response = await supertest(app)
        .post(`/api/v1/auth/signup`)
        .send(registerUserMock);
      dataTrack.push(response?._body?.data?._id);

      if (user) {
        expect(response.status).toBe(400);
      } else {
        expect(response.status).toBe(201);
      }
    });
  });

  describe("Login to your account", () => {
    it("should return 200", async () => {
      const user = await User.findOne({ email: loginUserMock.email });

      const response = await supertest(app)
        .post(`/api/v1/auth/signin`)
        .send(loginUserMock);

      if (!user) {
        expect(response.status).toBe(401);
      } else {
        expect(response.status).toBe(200);
      }
    });
  });

  afterEach(async () => {
    dataTrack.forEach(async (itemId) => {
      await User.findByIdAndDelete(itemId);
    });
  });
});
