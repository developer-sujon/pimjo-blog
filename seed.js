// const prisma = require("./src/prisma");
const { hashing } = require("./src/utils");

const mockUser = {
  name: "example",
  email: "user@example.com",
  password: "pass1234@",
};

const seedUser = async (prisma) => {
  const hashPassword = await hashing.generateHash(mockUser.password);

  const findUser = await prisma.user.findFirst();

  if (findUser === null) {
    const newUser = await prisma.user.create({
      data: {
        name: mockUser.name,
        email: mockUser.email,
        password: hashPassword,
      },
    });

    console.log(
      `Seed user creation successful for email ${newUser.email} passed ${mockUser.password}`
    );

    return newUser;
  }

  console.log(
    `Seed user find successful for email ${findUser.email} passed ${mockUser.password}`
  );

  return findUser;
};

module.exports = { seedUser, mockUser };
