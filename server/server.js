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
const port = process.env.PORT || 3333;
const httpsPort = process.env.HTTPS_PORT || 3334;

/* Initiate routes and db config */
RoutesConfig.init(app);
DBConfig.init();
Routes.init(app, express.Router());

/* Start the server! */
http.createServer(app).listen(port, () => {
  console.log(`up and running @: ${os.hostname()} on port: ${port}`);
  console.log(`enviroment: ${process.env.NODE_ENV}`);
});

/* Create and start a HTTPS server (for prod only) */
if (process.env.NODE_ENV === "production") {
  const sshOptions = {
    key: fs.readFileSync('~/.ssl/server.key'),
    cert: fs.readFileSync('~./.ssl/server.crt'),
    ca: fs.readFileSync('~/.ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
  };
  https.createServer(sshOptions, app).listen(port, () => {
    console.log(`up and running @: ${os.hostname()} on port: ${httpsPort}`);
    console.log(`enviroment: ${process.env.NODE_ENV}`);
  });
}
