
import TodoRoutes from "../api/todo/route/todo-route";
import TeamRoutes from "../api/records/team.route";
import SentimentsRoute from "../api/records/sentiments.route";

import StaticDispatcher from "../commons/static-dispatcher";

export default class Routes {
   static init(app, router) {
     TodoRoutes.init(router);
     TeamRoutes.init(router);
     SentimentsRoute.init(router);

     router
       .route("*")
       .get(StaticDispatcher.sendIndex);


     app.use("/", router);
   }
}
