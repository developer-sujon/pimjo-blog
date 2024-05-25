const prisma = require("./src/prisma");

const seedUser = () => {
  const user = prisma.user.create({
    data: {
      name: "example",
      email: "user@example.com",
      password: "123456@",
    },
  });

  return user;
};

module.exports = { seedUser };
