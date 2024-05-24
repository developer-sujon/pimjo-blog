const mongoose = require("mongoose");

let connectionURL = process.env.DB_CONNECTION_URL;
connectionURL = connectionURL.replace("<username>", process.env.DB_USERNAME);
connectionURL = connectionURL.replace("<password>", process.env.DB_PASSWORD);

const connectDB = async (DB_NAME) => {
  await mongoose.connect(connectionURL, { dbName: DB_NAME });
  console.log(`${DB_NAME} Database connected`);
};

module.exports = connectDB;
