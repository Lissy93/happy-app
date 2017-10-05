require('dotenv').config();

// if (process.env.NODE_ENV === "production")
    // require("newrelic");

const PORT = process.env.PORT || 3333;

import os from "os";
import express from "express";
import http from "http";
import RoutesConfig from "./config/routes.conf";
import DBConfig from "./config/db.conf";
import Routes from "./routes/index";

const app = express();

RoutesConfig.init(app);
DBConfig.init();
Routes.init(app, express.Router());

http.createServer(app)
    .listen(PORT, () => {
      console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
      console.log(`enviroment: ${process.env.NODE_ENV}`);
    });


// include and initialize the rollbar library with your access token
const Rollbar = require("rollbar");
const rollbar = new Rollbar("1b476045b935405488389a635cf0e471");

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");
