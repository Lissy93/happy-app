import mongoose from 'mongoose';
import Promise from 'bluebird';
import dbConst from './db.json';
const rollbar = require('../commons/error-tracking');

export default class DBConfig {

  /**
   * Database Initializer
   * If not yet connected, then connect to MongoDB
   * Track error state, and okay states to log
   */
  static init() {

    const URL = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URL
                                                          : dbConst.localhost;
    mongoose.Promise = Promise;

    /* If not already connected, call connect */
    if (!this.isConnected()) mongoose.connect(URL); // Attempt connection
    else return; // Already connected, so don't bother going any further

    /* Stuff isn't going so well */
    mongoose.connection.on('error', ()=>{
      DBConfig.trackMongooseError();
    });

    /* That's more like it */
    mongoose.connection.on('connected', ()=> {
      DBConfig.trackMongooseActions(`Mongoose connected to ${URL}`);
    });

    /* Times over mongoose. db has been disconnected */
    mongoose.connection.on('disconnected', ()=> {
      DBConfig.trackMongooseActions(`Mongoose disconnected from ${URL}`);
    });

  }

  /**
   * Determines if Mongo is already connected
   * @returns {boolean}
   */
  static isConnected(){
    return mongoose.connection.readyState !== 0;
  }

  /**
   * Drop the currently selected database
   * USE WITH CAUTION. Maybe back it up first...
   * @param cb
   */
  static deleteEverything(cb) {
    mongoose.connection.dropDatabase(cb);
  }

  /**
   * Safely close Mongo connection
   */
  static closeConnection() {
    mongoose.connection.close()
  }

  /**
   * Track and Log Mongoose errors
   */
  static trackMongooseError(){
    // Send to Rollbar
    rollbar.logWarning('Failed to Connect to Mongo');

    // Then log in console too
    console.error.bind(console, 'An error ocurred with the DB connection: ');
  }

  /**
   * Log to console and Mongoose to console and rollbar
   * @param message
   */
  static trackMongooseActions(message = 'Mongo Action'){
    // Send to Rollbar
    rollbar.logMessage(message);

    // Then log in console too
    console.log(message);
  }

}
