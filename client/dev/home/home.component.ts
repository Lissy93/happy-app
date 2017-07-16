import {Component, OnInit} from "@angular/core";

import {HomeService } from './home.service';

import {ActivatedRoute} from '@angular/router';
import {TeamService} from "../team.service";
import {AllTeamsService} from "../all-teams.service";
import {SharedModule} from "../shared-helpers.module";

@Component({
  selector: "home-page",
  templateUrl: "home/home.html",
  styleUrls: ["home/home.css"]
})
export class HomeComponent implements OnInit{

  title: string = "happy-app";
  teams: string[] = [];
  teamSummaryData: object[] = [];
  homepageChartData: object[] = [];

  constructor(
    private allTeamsService: AllTeamsService,
    private sharedModule: SharedModule
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
      (teamData) => { // okay, team data has arrived....

        const numDaysOfHistory = 7; // How many days back to go?
        this.teamSummaryData  = teamData; // Assign to class

        this.teamSummaryData.forEach((team)=>{ // For each team:
          team['data'].splice(numDaysOfHistory); // Splice to last X days
          const breakdown = this.sharedModule.getOverallSentimentCount((team)); // Get breakdown object

          // Get the average score
          let teamTotalScore = 0;
          team['data'].forEach((dateObject)=>{
            teamTotalScore += this.sharedModule.findAverageFromUserResults(dateObject.userResults);
          });
          const teamAverageScore =
             this.sharedModule.getPercentagePositive(teamTotalScore / numDaysOfHistory);

          // Create a results object for the homepage
          this.homepageChartData.push({
            teamName: team['teamName'],
            breakdown: breakdown,
            average: teamAverageScore
          });
        });


        console.log(this.homepageChartData); // Wooo, it's working!

      }

    );
  }




}
