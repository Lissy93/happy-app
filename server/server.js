require('dotenv').config();

/* In production mode, start tracking */
if (process.env.NODE_ENV === "production") {
  // New Relic
  require("newrelic");

  // Rollbar
  const Rollbar = require("rollbar");
  const rollbar = new Rollbar(process.env.ROLLBAR_KEY);
  rollbar.log("Application Started");

}


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


