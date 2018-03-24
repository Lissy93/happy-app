/**
 * The server.js file is the main entry point
 * called by index.js for the server
 * It is where every server action is triggered
 * Shouldn't contain any logic cde
 */

/* Import main server modules */
import os from "os";
import express from "express";
import http from "http";
import https from "https";
import fs from "fs";

/* Import route config, routes and db config */
import RoutesConfig from "./config/routes.conf";
import DBConfig from "./config/db.conf";
import Routes from "./routes/index";
require('dotenv').config();

/* Log app started message */
const rollbar = require("./commons/error-tracking");
rollbar.logMessage("App Started");

/* In production mode, start tracking */
if (process.env.NODE_ENV === "production") {
  require("newrelic");
}

/* Initiate the scheduler */
require('./commons/scheduler');

/* Initiate the app */
const app = express();

/* Specify the port, from .env or config */
const PORT = process.env.PORT || 3333;

/* Initiate routes and db config */
RoutesConfig.init(app);
DBConfig.init();
Routes.init(app, express.Router());

/* Create the server (HTTPS for prod) */
let server;
if (process.env.NODE_ENV === "production") {
  const sshOptions = {
    key: fs.readFileSync('~/.ssl/server.key'),
    cert: fs.readFileSync('~/.ssl/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
  };
  server = https.createServer(sshOptions, app);
}
else{
  server = http.createServer(app);
}

/* Start the server! */
server.listen(PORT, () => {
  console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
  console.log(`enviroment: ${process.env.NODE_ENV}`);
});
