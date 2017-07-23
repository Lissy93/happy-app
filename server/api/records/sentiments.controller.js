
const TeamRecordModel = require('../records/record.model');

export default class SentimentController {

  static getAll(req, res) {
    TeamRecordModel.find({ }, function(err, teams) {
      if (err) throw err;
      res.status(200).json(teams)
    });
  }

  static getTeam(req, res) {
    // Mongo gets array of all records with matching team name
    TeamRecordModel.find({teamName: req.params.teamName}, function(err, teams) {
      if (err) throw err;
      const results = (teams.length > 0 ? teams[0] : {}); // always be's JSON
      res.status(200).json(results)
    });
  }

  static getByDate(req, res) {

    // Specify date boundaries
    const dateInQuestion = req.params.date;
    let start = new Date(dateInQuestion);
    start.setHours(0,0,0,0);
    let end = new Date(dateInQuestion);
    end.setHours(23,59,59,999);

    TeamRecordModel.find({'data.date': {$gte: start, $lt: end} }, function(err, teams) {
      if (err) throw err;
      let returnResults = [];

      // Itterate through, and delete records with out of range dates
      teams.forEach((team)=>{
        team.data.forEach((dateObject, index)=>{
          if(dateObject.date < start || dateObject.date > end){
           delete team.data[index];
          }
        });
        team['data'] = team['data'].filter(n => true);
        returnResults.push(team);
      });
      res.status(200).json(returnResults)
    });

  }

}
