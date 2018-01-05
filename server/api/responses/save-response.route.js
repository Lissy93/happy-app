import SaveResponseController from "./save-response.controller";

export default class SaveResponse {
  static init(router) {

    router
      .route('/api/save-response')
      .get(SaveResponseController.getResponses)
      .post(SaveResponseController.saveResponse);

  }
}
