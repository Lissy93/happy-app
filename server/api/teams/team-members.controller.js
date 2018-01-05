import TeamMembersModel from './team-members.model';

export default class TeamMembersController {
  static getAll(req, res) {
    TeamMembersModel.find({ }, function(err, teams) {
      if (err) throw err;
      res.status(200).json(teams)
    });
  }

  static getById(req, res) {
    TeamMembersModel
      .getById(req.params.id)
      .then(byId => res.status(200).json(byId))
      .catch(error => res.status(400).json(error));
  }

  static addNewTeamMember(req, res) {
    let reqBody = req.body;
    TeamMembersModel
      .addNewTeamMember(reqBody)
      .then(todo => res.status(201).json(todo))
      .catch(error => res.status(400).json(error));
  }

  static delateTeamMember(req, res) {
    // let _id = req.params.id;
    //
    // TeamMembersModel
    //   .deleteTodo(_id)
    //   .then(() => res.status(200).end())
    //   .catch(error => res.status(400).json(error));
  }
}
