import Promise from "bluebird";
import TeamMembersModel from "../api/teams/team-members.model";
import EmailAddressHasher from "./email-address-hasher";
const TeamRecordSchema = require("../api/records/record.model");

class ResponseSaver {

  insertUserResponse(userResponse){
    let errorMessage = "Can't fetch error message."; // This will be overridden with correct err message

    return new Promise((resolve, reject) => {

      /* Ensure that the input is of a valid format */
      if (!ResponseSaver.checkInputIsValidJson(userResponse)){
          errorMessage = "Malformed input. Must be valid JSON.";
          return reject(new TypeError(errorMessage));
      }
      // TODO check if userhash is part of a valid team
      TeamMembersModel.find({ }, function(err, teams) {
        teams.forEach((team)=>{
          let teamName = team.teamName;
          team.members.forEach((member)=>{
            console.log(EmailAddressHasher.checkEmailAgainstHash(member.email));
            if(EmailAddressHasher.checkEmailAgainstHash(member.email)){
              console.log('user found, in team '+teamName);
            }
          })
        })
      });

      // TODO check user has not already responded today

      // TODO update record with new response

      // TODO return appropriate message

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
        err ? reject(err)
          : resolpve(saved);
      });
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

}

module.exports = ResponseSaver;
