import TeamMembersController from "./team-members.controller";

export default class TeamMembersRoute {
  static init(router) {
    router
      .route("/api/team-members")
      .get(TeamMembersController.getAll)
      .post(TeamMembersController.addNewTeamMember);
  };
}
