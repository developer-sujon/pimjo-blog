require("dotenv").config();
const http = require("http");
const app = require("./app");
const { seedUser } = require("../seed");
const prisma = require("./prisma");

const server = http.createServer(app);

const port = process.env.PORT || 4000;
const main = async () => {
  try {
    // await connectDB(process.env.APP_DB_NAME);
    server.listen(port, async () => {
      console.log(`Express server is listening at http://localhost:${port}`);
    });

    const findUser = await prisma.user.findFirst();

    if (!findUser) {
      const newUser = await seedUser();
      console.log(
        `Seed user creation successful for email ${newUser.email} passed ${newUser.password}`
      );
    }
  } catch (e) {
    console.log("Database Error");
    console.log(e);
  }
};

main();
