
const TeamRecordModel = require('../records/record.model');

export default class TeamNameController {

  static getAll(req, res) {
      let teamNames = [];
      TeamRecordModel.find({}, function(err, teams) {
        if (err) throw err;
        teams.forEach((team)=> teamNames.push(team.teamName))
        res.status(200).json(teamNames)
      });
  }

}
