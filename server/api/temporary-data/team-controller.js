export default class TodoController {
  static getAll(req, res) {
    res.status(200).json(['feature-team1','team-two','define-team','leadership']);
  }

}
