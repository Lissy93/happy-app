import { Component } from "@angular/core";
import {SharedModule} from "../shared-helpers.module";
import {AllTeamsService} from "../all-teams.service";

declare const c3, d3;

@Component({
  selector: "grid-chart",
  templateUrl: "grid-chart/grid-chart.html",
  styleUrls: ["grid-chart/grid-chart.css"]
})
export class GridChartComponent {

  teamSummaryData: object[];

  constructor(
    private allTeamsService: AllTeamsService,
    private sharedModule: SharedModule
  ){

    // Get raw summary data, and keep up-to-date
    this.teamSummaryData = this.allTeamsService.getTeamSummary();
    this.allTeamsService.teamDataUpdated.subscribe(
      (teamData) => { this.teamSummaryData  = teamData; }
    );
  }

}
