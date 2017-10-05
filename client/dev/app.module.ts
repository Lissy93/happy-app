import { NgModule, ErrorHandler, Injectable, Injector } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { BrowserModule  } from "@angular/platform-browser";
import { App }   from "./app";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent }   from "./pages/home/home.component";
import { homeRouting } from "./pages/home/home.route";
import { HomeService }   from "./pages/home/home.service";

import { NavbarComponent } from './components/navbar/navbar.component';
import { TimeChartComponent } from './components/time-chart/time-chart.component';
import { CalendarChartComponent } from './components/calendar-chart/calendar-chart.component';
import {OverviewChartComponent } from './components/overview-chart/overview-chart.component';
import {MaterialModule} from "@angular/material";
import {SharedModule} from "./shared-helpers.module";
import {LoaderComponent} from "./components/loader/loader.component";
import {TeamComponent} from "./pages/team/team.component";
import {TeamService} from "./services/team.service";
import {AllTeamsService} from "./services/all-teams.service";
import {GridChartComponent} from "./components/grid-chart/grid-chart.component";
import {DayBreakdownChartComponent} from "./components/day-breakdown-chart/day-breakdown-chart";
import {CommonService} from "./services/common.service";
import {SplashScreenComponent} from "./components/splash-screen/splash-screen";
import {AppFeedbackComponent} from "./components/app-feedback/app-feedback";
import {AppHelpComponent} from "./components/app-help/app-help";
import {MessageChartComponent} from "./components/message-chart/message-chart";
import { Angulartics2Module, Angulartics2GoogleTagManager } from "angulartics2";
import * as Rollbar from 'rollbar';

const rollbarConfig = {
  accessToken: 'e4289419268448dfb7752adb5d35b050',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) { }
  handleError(err:any) : void {
    this.injector.get(Rollbar);
    let rollbar = this.injector.get(Rollbar);
    rollbar.error(err.originalError || err);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    homeRouting,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleTagManager ])
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
    DayBreakdownChartComponent,
    LoaderComponent,
    SplashScreenComponent,
    AppFeedbackComponent,
    AppHelpComponent,
    MessageChartComponent
  ],
  providers: [
    HomeService,
    TeamService,
    AllTeamsService,
    CommonService,
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: Rollbar,
      useFactory: () => {
        return new Rollbar(rollbarConfig)
      }
    }
  ],
  bootstrap: [
    App
  ],
  entryComponents: [AppFeedbackComponent, AppHelpComponent]
})
export class AppModule {}
