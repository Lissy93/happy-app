import Promise from "bluebird";
import TeamMembersModel from "../api/teams/team-members.model";

import EmailAddressHasher from "./email-address-hasher";
import Helpers from "./helpers";

class ResponseSaver {

  insertUserResponse(userResponse){
    let errorMessage = "Can't fetch error message."; // This will be overridden with correct err message
    return new Promise((resolve, reject) => {

        /* Ensure that the input is of a valid format */
        if (!ResponseSaver.checkInputIsValidJson(userResponse)) {
          errorMessage = "Malformed input. Must be valid JSON.";
          return reject(new TypeError(errorMessage));
        }

        /* Put input into valid format */
        // userResponse = this.putInputIntoValidFormat(userResponse);
        resolve(userResponse);
      })
    .then((userResponse)=>{ // Check if part of team
      return new Promise(( resolve, reject) => {
        /* Check if user is part of a valid team*/
        ResponseSaver.checkIfUserFoundInTeam(userResponse.emailHash).then(
          (teamName) => {
            if (!teamName) { // User was not found in any team :(
              errorMessage = "User cold not be found.";
              return reject(new TypeError(errorMessage));
            }
            return resolve(teamName);
          })
      });
    })
    .then((teamName)=> {
        return new Promise((resolve, reject) => {
            /* Check that the user has not yet responded already today */
            ResponseSaver.checkIfUserAlreadySubmittedToday(userResponse.emailHash, teamName).then(
              (userNotYetSubmitted) => {
                console.log("userNotYetSubmitted ", userNotYetSubmitted);
                resolve(userNotYetSubmitted);
              }
            )
          }
        );
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
   * If input was passed as a string, quickly convert it to an object
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
    return new Promise((resolve, reject) => {
      TeamMembersModel.find({}, (err, teams) => {
        teams.forEach((team) => {
          let teamName = team.teamName;
          team.members.forEach((member) => {
            if (EmailAddressHasher.checkEmailAgainstHash(member.email, userHash)) {
              console.log('user found');
              resolve(teamName)
            }
          })
        });
        reject()
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
    return new Promise((resolve, reject) => {
      const TeamRecordModel = require('../api/records/record.model');
      TeamRecordModel.find({teamName: teamName}, function(err, teams) {
        if (err) reject(err);
        resolve(ResponseSaver.checkUserDataForResponse(userHash, teamName, teams))
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
              return true;
            }
          });
        }
      });
    }
    return false;
  }

  /**
   * Does/ attempts the actual insert
   * Should only be called once all checks have been carried out
   * @param userResponse
   */
  static makeTheInsert(userResponse){
    return new Promise((resolve, reject) => {

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
        err ? reject(err) : resolve(saved);
      });
    });
  }


}

module.exports = ResponseSaver;
