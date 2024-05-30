const express = require("express");
const { applyMiddleware } = require("./middlewares");
const routes = require("./routes/v1");

// express app
const app = express();
applyMiddleware(app);
app.use(routes);

app.get("/health", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    health: "OK",
  });
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new error.NOT_FOUND());
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.log(err); // Log the error for debugging purposes
  res.status(err.status || 500).json({
    statusCode: err.status || 500,
    message: err.message || "Internal Server Error",
    errors: err.errors,
  });
});

module.exports = app;
