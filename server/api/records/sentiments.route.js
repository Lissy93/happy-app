import SentimentsController from "./sentiments.controller";

export default class SentimentsRoutes {
  static init(router) {

    router
      .route('/api/team-sentiment')
      .get(SentimentsController.getAll);

    router
      .route('/api/team-sentiment/:teamName')
      .get(SentimentsController.getTeam);

    router
      .route('/api/date/:date')
      .get(SentimentsController.getByDate);
  }
}
