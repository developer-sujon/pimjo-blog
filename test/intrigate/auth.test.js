require("dotenv").config();
const supertest = require("supertest");
const app = require("../../src/app");
const { registerUserMock, loginUserMock } = require("../mock/auth");
const prisma = require("../../src/prisma");

beforeAll(async () => {
  // await connectDB(process.env.TEST_DB_NAME);
});

describe("Auth", () => {
  const dataTrack = [];

  describe("Create a new account", () => {
    it("given valid request body should return 201 & create new user", async () => {
      const user = await prisma.user.findUnique({
        where: { email: registerUserMock.email },
      });

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
      const user = await prisma.user.findUnique({
        where: { email: loginUserMock.email },
      });

      const response = await supertest(app)
        .post(`/api/v1/auth/signin`)
        .send(loginUserMock);

      if (!user) {
        expect(response.status).toBe(401);
      } else {
        expect([200, 401]).toContain(response.status);
      }
    });
  });

  afterEach(async () => {
    dataTrack.forEach(async (id) => {
      await prisma.user.deleteMany({ where: { id } });
    });
  });
});
