import {Component, OnInit} from "@angular/core";

import {HomeService } from './home.service';

import {ActivatedRoute} from '@angular/router';
import {TeamService} from "../team.service";
import {AllTeamsService} from "../all-teams.service";

@Component({
  selector: "home-page",
  templateUrl: "home/home.html",
  styleUrls: ["home/home.css"]
})
export class HomeComponent implements OnInit{

  title: string = "happy-app";
  teams: string[] = [];
  teamSummaryData: object[] = [];

  constructor(
    private allTeamsService: AllTeamsService
  ) {}


  ngOnInit() {

    // Get the list of teams
    this.teams = this.allTeamsService.getTeams();
    this.allTeamsService.teamListUpdated.subscribe(
      (teams) => { this.teams  = teams; }
    );

    // Get the team summary data (to display homepage visualisations)
    this.teamSummaryData = this.allTeamsService.getTeamSummary();
    this.allTeamsService.teamDataUpdated.subscribe(
      (teamData) => { this.teamSummaryData  = teamData; }
    );
  }
}
