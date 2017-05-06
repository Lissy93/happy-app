"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var home_component_1 = require("./home.component");
var homeRoutes = [
    {
        path: "",
        component: home_component_1.HomeComponent,
        pathMatch: "full"
    }
];
exports.homeRouting = router_1.RouterModule.forRoot(homeRoutes);
