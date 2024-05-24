const connectDB = require("./connectDB");
const schemaOption = {
  timestamps: true,
  versionKey: false,
};

module.exports = { connectDB, schemaOption };
