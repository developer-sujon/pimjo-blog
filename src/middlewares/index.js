const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const OpenApiValidator = require("express-openapi-validator");
const { default: helmet } = require("helmet");
const compression = require("compression");
const swaggerDoc = YAML.load("./swagger.yaml");
module.exports.authenticate = require("./authenticate");
module.exports.ownership = require("./ownership");

module.exports.applyMiddleware = (app) => {
  app.use(express.json());
  app.use(morgan("dev"));

  // set security HTTP headers
  app.use(helmet());

  // parse json request body
  app.use(express.json());

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  // sanitize request data

  // gzip compression
  app.use(compression());

  // enable cors
  app.use(cors());
  app.options("*", cors());

  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  app.use(
    OpenApiValidator.middleware({
      apiSpec: "./swagger.yaml",
    })
  );
};
