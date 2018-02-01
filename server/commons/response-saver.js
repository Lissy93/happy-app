import Promise from "bluebird";
import TeamMembersModel from "../api/teams/team-members.model";
const TeamRecordModel = require('../api/records/record.model');


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
    .then((userResponse)=>{
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
    .then(
      (teamName)=> {
        return new Promise((resolve, reject) => {
            /* Check that the user has not yet responded already today */
            ResponseSaver.checkIfUserAlreadySubmittedToday(userResponse.emailHash, teamName).then(
              (userNotYetSubmitted) => {

                console.log("userNotYetSubmitted ", userNotYetSubmitted);

                if(userNotYetSubmitted){

                }
              }
            )
          }
        );
      });
      //
      // // TODO check user has not already responded today
      //
      // // TODO update record with new response
      //
      // // TODO return appropriate message
      //
      // let teamUserResponse = {
      //   teamName:  "demo",
      //   data: [
      //     {
      //       date: new Date(),
      //       userResults: [ userResponse ]
      //     }
      //   ]
      // };
      //
      // const _userResponse = new TeamRecordSchema(teamUserResponse);
      //
      // _userResponse.save((err, saved) => {
      //   err ? reject(err)
      //     : resolpve(saved);
      // });
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

  static checkIfUserAlreadySubmittedToday(userHash, teamName){
    return new Promise((resolve, reject) => {

      /* Get today's date */
      const today = Helpers.roundDate(new Date());

      /* Make request */
      const TeamRecordModel = require('../api/records/record.model');
      TeamRecordModel.find({teamName: teamName}, function(err, teams) {
        if (err) reject(err);
        let teamData = (teams.length > 0 ? teams[0] : {}); // always be's JSON!

        if(teamData.length > 1){ teamData = teamData[0]; }

          if(Helpers.normaliseString(teamData.teamName) === Helpers.normaliseString(teamName)){
            teamData.data.forEach((dateBlock)=>{
              if( Helpers.isDateToday(dateBlock.date)) {
                dateBlock.userResults.forEach((userResult) => {
                  if(userResult.userHash === userHash){ resolve(true);}
                });
              }
            });
          }
        resolve(false)
      });

      });
    }


}

module.exports = ResponseSaver;
