import mongoose from "mongoose";
import Promise from "bluebird";
import dbConst from "../constants/db.json";

export default class DBConfig {

    static init() {

      const URL = (process.env.NODE_ENV === "production") ? process.env.MONGOHQ_URL
                                                          : dbConst.localhost;
      mongoose.Promise = Promise;
      mongoose.connect(URL); //todo check if not connected first
      mongoose.connection.on("error", this.trackMongooseError);
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
