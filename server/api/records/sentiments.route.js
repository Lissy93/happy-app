import SentimentsController from "./sentiments.controller";

export default class SentimentsRoutes {
  static init(router) {
    router
      .route('/api/team-sentiment/:teamName')
      .get(SentimentsController.getAll);
  }
}
