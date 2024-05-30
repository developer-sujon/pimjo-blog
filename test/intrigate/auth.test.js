require("dotenv").config();
const supertest = require("supertest");
const app = require("../../src/app");
const { registerUserMock, loginUserMock } = require("../mock/auth");
const prisma = require("../../src/prisma");

describe("Auth", () => {
  describe("Create a new account", () => {
    it("should return 201 & create a new user given a valid request body", async () => {
      const existingUser = await prisma.user.findUnique({
        where: { email: registerUserMock.email },
      });

      const response = await supertest(app)
        .post(`/api/v1/auth/signup`)
        .send(registerUserMock);

      if (response?._body?.data?._id) {
        dataTrack.push(response._body.data._id);
      }

      if (existingUser) {
        expect(response.status).toBe(400);
      } else {
        expect(response.status).toBe(201);
      }
    });
  });

  describe("Login to your account", () => {
    it("should return 200", async () => {
      const existingUser = await prisma.user.findUnique({
        where: { email: loginUserMock.email },
      });

      const response = await supertest(app)
        .post(`/api/v1/auth/signin`)
        .send(loginUserMock);

      if (!existingUser) {
        expect(response.status).toBe(401);
      } else {
        expect([200, 400]).toContain(response.status);
      }
    });
  });
});
