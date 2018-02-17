import Promise from "bluebird";
import TeamMembersModel from "../api/teams/team-members.model";

import EmailAddressHasher from "./email-address-hasher";
import Helpers from "./helpers";

class ResponseSaver {

  /**
   * This is the main function that gets called
   * to kick off the saving response process
   * @param userResponse
   */
  insertUserResponse(userResponse){
    return new Promise((resolve) => {

        /* Ensure that the input is of a valid format */
        if (!ResponseSaver.checkInputIsValidJson(userResponse)) {
          resolve(ResponseSaver.thereWasAnError("invalidInput"));
        }
        userResponse = ResponseSaver.putInputIntoValidFormat(userResponse);
        resolve(userResponse);
      })
    .then((userResponse)=>{ // Check if part of team

      return new Promise(( resolve) => {

        /* If there was an err in a previous step, then skip this step */
        ResponseSaver.passDownTheError(userResponse, resolve);

        /* Check if user is part of a valid team*/
        ResponseSaver.checkIfUserFoundInTeam(userResponse.emailHash).then(
          (teamName) => {

            console.log("Team Name: ", teamName);

            /* Check for previous errors, if there immediately resolve*/
            ResponseSaver.passDownTheError(teamName, resolve);

            /* If the user wasn't found, take action, else return team name */
            if (!teamName) { // User was not found in any team :(
              resolve(ResponseSaver.thereWasAnError("userNotFound"));
            }
            return resolve(teamName);
          })
      });
    })
    .then((teamName)=> {

      return new Promise((resolve) => {

        /* Check previous error */
        ResponseSaver.passDownTheError(teamName, resolve);

          /* Check that the user has not yet responded already today */
            ResponseSaver.checkIfUserAlreadySubmittedToday(userResponse.emailHash, teamName).then(
              (userNotYetSubmitted) => {

                ResponseSaver.passDownTheError(userNotYetSubmitted, resolve);

                if(!userNotYetSubmitted) { // no idea why they'd want to submit twice- but they just tried it!
                  resolve(ResponseSaver.thereWasAnError("userAlreadySubmitted"));
                }
                else{
                  resolve(userNotYetSubmitted);
                }

              }
            )} // End promise
        );
      })
      .catch(e => {
        resolve(ResponseSaver.thereWasAnError("errorCheckingDupResponses", e));
      });
  }

  /**
   * Determines weather input is of a valid format
   * @param input
   * @returns {boolean}
   */
  static checkInputIsValidJson(input) {
    if (typeof input === 'string' || input instanceof String) {
      return (/^[\],:{}\s]*$/.test(input
        .replace(/\\["\\\/bfnrtu]/g, '@')
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
    }
    else {
      return (typeof input === 'object' || input instanceof Object);
    }
  }

  /**
   * Quickly make input clean,
   * in case come idiot (probably me) tries to pass the wrong format
   * @param input
   * @returns {*}
   */
  static putInputIntoValidFormat (input) {
    if (typeof input === 'string' || input instanceof String) {
      return JSON.parse(input);
    }
    return input;
  }

  /**
   * A promise function that checks if a
   * given user (specified by a hash) exists
   * If user found, resolves with the teamName of member
   * @param userHash
   */
  static checkIfUserFoundInTeam(userHash) {
    return new Promise((resolve) => {

      ResponseSaver.passDownTheError(userHash, resolve);

      TeamMembersModel.find({}, (err, teams) => {
        if(!teams || teams.length < 1){
          resolve(ResponseSaver.thereWasAnError("noTeamsLoaded"));
        }
        teams.forEach((team) => {
          let teamName = team.teamName;
          team.members.forEach((member) => {
            if (EmailAddressHasher.checkEmailAgainstHash(member.email, userHash)) {
              resolve(teamName)
            }
          })
        });
        resolve(ResponseSaver.thereWasAnError("unableToCheckForTeams"));
      });
    });
  }

  /**
   * Determines if a given user (in a given team)
   * has already submitted a response for today
   * @param userHash
   * @param teamName
   */
  static checkIfUserAlreadySubmittedToday(userHash, teamName){
    return new Promise((resolve) => {

      ResponseSaver.passDownTheError(userHash, resolve);
      ResponseSaver.passDownTheError(teamName, resolve);

      const TeamRecordModel = require('../api/records/record.model');
      TeamRecordModel.find({teamName: teamName}, function(err, teams) {
        if (err){
          resolve(ResponseSaver.thereWasAnError("errorCheckingDupResponses"));
        }
        else{
          resolve(ResponseSaver.checkUserDataForResponse(userHash, teamName, teams))
        }
      });
    });
  }

  /**
   * A private function that does the logic part of the
   * checking weather a user has already submitted a response
   * @param userHash
   * @param teamName
   * @param userData
   * @returns {boolean}
   */
  static checkUserDataForResponse(userHash, teamName, userData){

    let teamData = (userData.length > 0 ? userData[0] : {}); // always be's JSON!

    if(teamData.length > 1){ teamData = teamData[0]; }

    if(Helpers.normaliseString(teamData.teamName) === Helpers.normaliseString(teamName)){
      teamData.data.forEach((dateBlock)=>{
        if( Helpers.isDateToday(dateBlock.date)) {
          dateBlock.userResults.forEach((userResult) => {
            if(userResult.userHash === userHash){
              return false
            }
          });
        }
      });
    }
    return true;
  }

  /**
   * Does/ attempts the actual insert
   * Should only be called once all checks have been carried out
   * @param userResponse
   */
  static makeTheInsert(userResponse){
    return new Promise((resolve) => {

      const TeamRecordSchema = require('../api/records/record.model');

      let teamUserResponse = {
        teamName:  "demo",
        data: [
          {
            date: new Date(),
            userResults: [ userResponse ]
          }
        ]
      };

      const _userResponse = new TeamRecordSchema(teamUserResponse);
      _userResponse.save((err, saved) => {
        err ? resolve(ResponseSaver.thereWasAnError("unableToMakeInsert", err)) : resolve(saved);
      });
    });
  }

  /**
   * Called when there is an error inserting user response
   * This could anything from something major like server down,
   * to something trivial, like user already submitted a response today
   * All errors are recorded in Rollbar/ error tracker
   * And a meaningful English error message is shown to the user.
   */
  static thereWasAnError(errMessageKey="defaultErr", err=null){

    /* These are the en-GB error messages for the user */
    const errorMessages = {
      defaultErr:               "Failed save user response. (Error Code: SR001)",
      shitsReallyGoneWrong:     "Failed save user response. (Error Code: SR002)",
      iHaveNoClueWtfWentWrong:  "Failed save user response. (Error Code: SR003)",
      evenTheErrCodeIsInvalid:  "Failed save user response. (Error Code: SR004)",
      invalidInput:             "Malformed input. Must be valid JSON. (Error Code: SR005)",
      userNotFound:             "The specified user wasn't found. (Error Code: SR006)",
      userAlreadySubmitted:     "Your response has already been recorded today. (Error Code: SR007)",
      errorCheckingDupResponses:"There was a problem while checking for previous responses. (Error Code: SR008)",
      noTeamsLoaded:            "Error checking users team: No teams were loaded. (Error Code: SR009)",
      unableToCheckForTeams:    "User not registered in team. (Error Code: SR010)",
      unableToMakeInsert:       "Unable to insert response into the DB. (Error Code: SR011)"
    };

    /* Make error object */
    const userErrMessage  = (errorMessages.hasOwnProperty(errMessageKey)?
        errorMessages[errMessageKey] : errorMessages.evenTheErrCodeIsInvalid);
    const errorJson = {
      wasThereAnError: true,
      userErrMessage: userErrMessage,
      stackTrace: err
    };

    /* Submit an error report */
    const errorTracking = require('../commons/error-tracking');
    errorTracking.logWarning("Unable to save user response.", errorJson);
    console.warn("Unable to save user response.", errorJson.userErrMessage);

    /* Return error message, to be rendered as request response */
    return errorJson;
  }

  /**
   * So the logic here is, that if there's an error at any stage
   * we replace the param with an error object
   * (containing the attribute of 'wasThereAnError').
   * In this function we then check if there is an error,
   * and if there was call resolve strait away
   * as there's no point going any further
   * @param stuffToCheck - we will check if this is an err obj
   * @param res - this is the local resolve() func
   */
  static passDownTheError(stuffToCheck, res){
    if(stuffToCheck.wasThereAnError) res(stuffToCheck);
  }

}

module.exports = ResponseSaver; // The End.

/**
 * When I wrote this, only God and I understood what I was doing.
 * Now, God only knows.
 */

// ^^ Have fun maintaining it!
