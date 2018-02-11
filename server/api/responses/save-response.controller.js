
import TeamRecordModel from '../records/record.model'

export default class SaveResponseController {

  static saveResponse(req, res) {
    let _response = req.body;
    TeamRecordModel
      .insertUserResponse(_response)
      .then(data => res.status(201).json(data))
      .catch(
        (error) => {
          console.log("caught ", error);
          res.status(400).json(error)
        });
  }

  static getResponses(req, res) {
    TeamRecordModel.find({ }, function(err, teams) {
      if (err) res.status(400).json({});
      res.status(200).json(SaveResponseController.makeFlatResponses(teams));
    });
  }

  static makeFlatResponses(teams){
    let results = [];
    teams.forEach((team)=> {
      team.data.forEach((dateBlock)=> {
        dateBlock.userResults.forEach((response)=>{
          results.push({
            teamName: team.teamName,
            date: dateBlock.date,
            userHash: response.userHash,
            score: response.score,
            comment: response.comment
          });
        });
      });
    });
    return results;
  }

  static findUsersTeam(){

  }

}
