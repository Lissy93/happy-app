import {Component, OnInit} from "@angular/core";
import {AllTeamsService} from "../all-teams.service";
import {SharedModule} from "../shared-helpers.module";
import {CommonService} from "../common.service";

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
  dataReturned: boolean = false;

  constructor(
    private allTeamsService: AllTeamsService,
    private sharedModule: SharedModule,
    private commonService: CommonService
  ) {}


  /**
   * Applies fancy tooltip to a given element
   * @param event
   */
  applyTooltip(event?){
    tippy('.has-tooltip', {arrow: true});
    if(event){
      let target = event.target || event.srcElement || event.currentTarget;
      if(target.attributes.title) {
        tippy(target, {arrow: true});
      }
    }
  }

  /**
   * Capitalize first letter
   * @param str
   * @returns {string}
   */
  static capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

  /**
   * Lol just does everything in the init, cos why not
   * TODO refactor into smaller, more readable functions
   */
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

        // Hide the splash screen
        this.dataReturned = true;

        // Call to render the day breakdown chart
        let dateForBreadkwonChart = this.wereThereAnyResultsForYesterdayButNotToday(teamData);
        this.commonService.notifyDateSquareClicked(dateForBreadkwonChart);

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

          // Initiate tooltips for homepage elements
          this.applyTooltip();

        });
      }
  );
  }

  /**
   * Lol objective-C style function name
   * If there weren't no results for today, we just return yesterdays date
   * e.g. for when the app is being used in the morning
   * @param rawData
   * @returns {Date}
   */
  private wereThereAnyResultsForYesterdayButNotToday(rawData){
    let dateToReturn = new Date(); // today, by default
    if(rawData.length == 0){ return dateToReturn; } // If there isn't actually any data, lets just give up
   if(this.sharedModule.showLastXDays(rawData[0], 0).data.length == 0){ // If there's no data for today
     if(this.sharedModule.showLastXDays(rawData[0], 1).data.length > 0){ // But there is data for yesterday
       let d = new Date();
       dateToReturn = new Date(d.setDate(d.getDate() - 1)); // Then find the date of yesterday, and use theat
       }
   }
   return dateToReturn;
  }
}
