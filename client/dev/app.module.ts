import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule, FormBuilder } from "@angular/forms";
import { BrowserModule  } from "@angular/platform-browser";
import { App }   from "./app";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent }   from "./home/home.component";
import { homeRouting } from "./home/home.route";
import { HomeService }   from "./home/home.service";

import { NavbarComponent } from './navbar/navbar.component';
import { TimeChartComponent } from './time-chart/time-chart.component';
import { CalendarChartComponent } from './calendar-chart/calendar-chart.component';
import {OverviewChartComponent } from './overview-chart/overview-chart.component';
import {MaterialModule} from "@angular/material";
import {SharedModule} from "./shared-helpers.module";
import {LoaderComponent} from "./loader/loader.component";
import {TeamComponent} from "./team/team.component";
import {TeamService} from "./team.service";
import {AllTeamsService} from "./all-teams.service";
import {GridChartComponent} from "./grid-chart/grid-chart.component";

@NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      homeRouting,
      BrowserAnimationsModule,
      MaterialModule,
      SharedModule
    ],
    declarations: [
      App,
      HomeComponent,
      TeamComponent,
      NavbarComponent,
      TimeChartComponent,
      OverviewChartComponent,
      CalendarChartComponent,
      GridChartComponent,
      LoaderComponent
    ],
    providers: [
      HomeService,
      TeamService,
      AllTeamsService
    ],
    bootstrap: [
      App
    ],
})
export class AppModule {}
