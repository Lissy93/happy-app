
const TeamRecordModel = require('../records/record.model');

export default class SentimentController {

  static getAll(req, res) {
    // Mongo gets array of all records with matching team name
    TeamRecordModel.find({teamName: req.params.teamName}, function(err, teams) {
      if (err) throw err;
      const results = (teams.length > 0 ? teams[0] : {}); // always be's JSON
      res.status(200).json(results)
    });
  }

}
