require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectDB } = require("./database");
const { seedUser } = require("../seed");
const { User } = require("./schema");

const server = http.createServer(app);

const port = process.env.PORT || 4000;
const main = async () => {
  try {
    await connectDB();
    server.listen(port, async () => {
      console.log(`Express server is listening at http://localhost:${port}`);
    });

    const findUser = await User.findOne();

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
