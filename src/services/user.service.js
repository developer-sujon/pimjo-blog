const prisma = require("../prisma");
const { error } = require("../utils");

const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user ? user : false;
};

const userExist = async (email) => {
  const user = await findUserByEmail(email);
  return user ? true : false;
};

const createUser = async ({ name, email, password }) => {
  if (!name || !email || !password)
    throw error.badRequest("Invalid parameters");

  return await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};

module.exports = {
  userExist,
  findUserByEmail,
  createUser,
};
