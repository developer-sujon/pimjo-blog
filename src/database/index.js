const connectDB = require("./connectDB");
const schemaOption = {
  timestamps: true,
  id: true,
  versionKey: false,
};

module.exports = { connectDB, schemaOption };
