const getDatabaseUrl = (dbUrl) => {
  if (!dbUrl) {
    throw new Error("DB_CONNECTION_URL environment variable is not set.");
  }

  return dbUrl;
};

module.exports.getDatabaseUrl = getDatabaseUrl;
