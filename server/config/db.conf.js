import mongoose from "mongoose";
import Promise from "bluebird";
import dbConst from "../constants/db.json";

export default class DBConfig {

  static init() {

    const URL = (process.env.NODE_ENV === "production") ? process.env.MONGOHQ_URL
                                                          : dbConst.localhost;
      mongoose.Promise = Promise;

      /* Attempt Connection */
      if( !this.isConnected() ) {
        mongoose.connect(URL); //todo check if not connected first
      }

      /* Stuff isn't going so well */
      mongoose.connection.on("error", function (){
        this.trackMongooseError();
      });

      /* That's more like it */
      mongoose.connection.on("connected", function(ref) {
        console.log("Connected to " + URL + " DB!");
      });

      /* Times over mongoose. When the db has been disconnected */
      mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection to DB :' + URL + ' disconnected');
      });

    }

    static isConnected(){
      return mongoose.connection.readyState !== 0;
    }

    static deleteEverything(cb) {
      mongoose.connection.dropDatabase(cb);
    }

    static closeConnection() {
      mongoose.connection.close()
    }

  static trackMongooseError(){
    // Send to Rollbar
    const rollbar = require("../commons/tracking/error-tracking");
    rollbar.logWarning("Failed to Connect to Mongo");

    // Then log in console too
    console.error.bind(console, "An error ocurred with the DB connection: ");
  }
};
