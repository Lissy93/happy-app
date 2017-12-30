
const TeamRecordModel = require('../records/record.model');
export default class TeamNameController {

  static getAll(req, res) {
    const rollbar = require("../../commons/error-tracking"); // for tracking
    let teamNames = [];
      TeamRecordModel.find({}, function(err, teams) {
        if (err) rollbar.logWarning("Unable to fetch team list", err);
        else{ // no error, all should be fine
          teams.forEach((team)=> teamNames.push(team.teamName));
          res.status(200).json(teamNames);
          rollbar.logMessage("Team List returned", teamNames);

        }
      });
  }

}
