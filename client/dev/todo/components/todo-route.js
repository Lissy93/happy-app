"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var todo_cmp_1 = require("../components/todo-cmp");
var todoRoutes = [
    {
        path: "",
        component: todo_cmp_1.TodoCmp,
        pathMatch: "full"
    }
];
exports.todoRouting = router_1.RouterModule.forRoot(todoRoutes);
//# sourceMappingURL=todo-route.js.map