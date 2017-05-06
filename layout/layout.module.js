"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
// import { MdToolbarModule } from '@angular/material';
var home_component_1 = require("./home/home.component");
var home_service_1 = require("./home/home.service");
var home_route_1 = require("./home/home.route");
var LayoutModule = (function () {
    function LayoutModule() {
    }
    return LayoutModule;
}());
LayoutModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, home_route_1.homeRouting],
        declarations: [home_component_1.HomeComponent],
        bootstrap: [home_component_1.HomeComponent],
        providers: [home_service_1.HomeService],
    })
], LayoutModule);
exports.LayoutModule = LayoutModule;
