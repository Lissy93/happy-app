
import TodoRoutes from "../api/todo/route/todo-route";
import TeamRoutes from "../api/temporary-data/team-route";

import StaticDispatcher from "../commons/static/index";

export default class Routes {
   static init(app, router) {
     TodoRoutes.init(router);
     TeamRoutes.init(router);

     router
       .route("*")
       .get(StaticDispatcher.sendIndex);


     app.use("/", router);
   }
}
