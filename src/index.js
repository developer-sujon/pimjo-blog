require("dotenv").config();
const http = require("http");
const app = require("./app");
const { seedUser, mockUser } = require("../seed");
const prisma = require("./prisma");

const server = http.createServer(app);

const port = process.env.PORT || 4000;
const main = async () => {
  try {
    server.listen(port, async () => {
      console.log(`Express server is listening at http://localhost:${port}`);

      try {
        await prisma.$connect();
        console.log("Prisma successfully connected to the database.");

        /**
         * seed user
         */
        await seedUser(prisma);
      } catch (e) {
        console.log("Error connecting to the database:", e);
        throw e;
      } finally {
        await prisma.$disconnect();
      }
    });
  } catch (e) {
    console.log(e);
    server.close();
  }
};

main();
