import TeamController from "../temporary-data/team-controller";

export default class TeamRoutes {
  static init(router) {
    router
      .route("/api/teams")
      .get(TeamController.getAll);
  }
}
