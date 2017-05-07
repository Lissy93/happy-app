export default class TodoController {
  static getAll(req, res) {
    res.status(200).json({"hello":"world"});
  }

}
