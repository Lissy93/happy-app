import { Component, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

import {AllTeamsService} from "../../services/all-teams.service";
import {SharedModule} from "../../shared-helpers.module";
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

declare const tippy;

@Component({
  selector: "home-page",
  templateUrl: "pages/home/home.html",
  styleUrls: ["pages/home/home.css"]
})
export class HomeComponent implements OnInit, OnDestroy{

  title: string = "happy-app";
  teams: string[] = [];
  teamSummaryData: object[] = [];
  homepageChartData: object[] = [];
  dataReturned: boolean = false;
  ngUnsubscribe: Subject<void> = new Subject<void>(); // Used for better unsubscribing
  router: Router;

  constructor(
    private allTeamsService: AllTeamsService,
    private sharedModule: SharedModule,
    private commonService: CommonService,
    router: Router
  ) {
    this.router = router;
  }

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
   * Takes user to team route. Used for home-list-chart
   * @param teamName
   */
  navigateToTeam(teamName) {
    this.router.navigate([`./team/${teamName}`]);
  }

  /**
   * Capitalize first letter
   * @param str
   * @returns {string}
   */
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Lol just does everything in the init, cos why not
   * TODO refactor into smaller, more readable functions - (partially done now)
   */
  ngOnInit() {

    // Constants for hiding the splash screen at right time
    const startTime = Date.now();
    const firstTimeSplashTime = 1500;
    const minSplashTime = (this.allTeamsService.getTeams().length > 0)? 0 : firstTimeSplashTime;
    const splashHideTime = startTime + minSplashTime;

    // Get the list of teams
    this.teams = this.allTeamsService.getTeams();
    this.allTeamsService.teamListUpdated.takeUntil(this.ngUnsubscribe).subscribe(
      (teams) => { this.teams  = teams; }
    );

    // Get the team summary data (to display homepage visualisations)
    this.teamSummaryData = this.allTeamsService.getTeamSummary();
    this.allTeamsService.teamDataUpdated.takeUntil(this.ngUnsubscribe).subscribe(
      (teamData) => { // okay, team data has arrived....

        // Call to render home page charts
        this.renderBreakdownChart(teamData);

        // Hide the splash screen
        setTimeout(()=>{ this.dataReturned = true; }, splashHideTime - Date.now());
      }
  );
  }

  /**
   * Unsubscribe to stuff
   */
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Renders the team summary list on the homepage
   * @param teamData
   */
  renderBreakdownChart(teamData){
    // Call to render the day breakdown chart
    let dateForBreadkwonChart = this.wereThereAnyResultsForYesterdayButNotToday(teamData);
    this.commonService.notifyDateSquareClicked(dateForBreadkwonChart);

    const numDaysOfHistory = 3; // How many days back to go?
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
