const { PrismaClient } = require("@prisma/client");
const { getDatabaseUrl } = require("./database");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(process.env.DB_CONNECTION_URL),
    },
  },
});

module.exports = prisma;
