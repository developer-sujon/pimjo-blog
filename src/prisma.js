const { PrismaClient } = require("@prisma/client");
const { getDatabaseUrl } = require("./database");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(process.env.DB_CONNECTION_URL),
    },
  },
});

(async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Prisma successfully connected to the database.");
  } catch (e) {
    console.error("Error connecting to the database:", e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
})();

module.exports = prisma;
