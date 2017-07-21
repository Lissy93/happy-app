import {Component, OnInit} from "@angular/core";
import {AllTeamsService} from "../all-teams.service";
import {SharedModule} from "../shared-helpers.module";

declare const tippy;

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


  /**
   * Applies fancy tooltip to a given element
   * @param event
   */
  applyTooltip(event){
    let target = event.target || event.srcElement || event.currentTarget;
    if(target.attributes.title) {
      tippy(target, {arrow: true});
    }
  }

  static capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

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

          // Get breakdown of scores
          const breakdown = this.sharedModule.getOverallSentimentCount((team));
          let bdText = '';
          Object.keys(breakdown).reverse().forEach((label)=>{
            bdText += `${HomeComponent.capitalize(label)}: ${breakdown[label]}, `
          });
          if (bdText){
            bdText = bdText.substring(0, bdText.length - 1); // Remove trailing comma
          }

          // Get the average score
          let teamTotalScore = 0;
          team['data'].forEach((dateObject)=>{
            teamTotalScore += this.sharedModule.findAverageFromUserResults(dateObject.userResults);
          });
          const teamAverageScore =
             this.sharedModule.getPercentagePositive(teamTotalScore / numDaysOfHistory);

          // Calculate text color
          let textColor = '#DBDBDB';
          switch(true){
            case teamAverageScore <= 40:
              textColor = '#BB5337';
              break;
            case teamAverageScore <= 60:
              textColor = '#D3D030';
              break;
            case teamAverageScore <= 100:
              textColor = '#4DC54E';
          }

          // Create a results object for the homepage
          this.homepageChartData.push({
            teamName: HomeComponent.capitalize(team['teamName']),
            breakdown: bdText,
            average: teamAverageScore,
            color: textColor
          });
        });
      }
  );
  }
}
