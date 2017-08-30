import {Component, OnInit} from "@angular/core";
import {TeamService} from "../../services/team.service";
import {SharedModule} from "../../shared-helpers.module";
declare const  moment, tippy;

@Component({
  selector: "message-chart",
  templateUrl: "components/message-chart/message-chart.html",
  styleUrls: ["components/message-chart/message-chart.css"]
})

export class MessageChartComponent implements OnInit {

  rawData: any = {};      // The returned, un-formatted team data
  chartVisible: boolean;  // If true chart will show
  loading: boolean = true;// Show to loading spinner
  comments: any = [];
  show: number = 5;

  constructor(
    private teamService: TeamService,
    private sharedModule: SharedModule
  ){}

  ngOnInit(): void {
    this.teamService.sentimentDataUpdated.subscribe(
      (teamSentimentData) => {
        this.rawData = teamSentimentData;
        this.updateChart(teamSentimentData);
      }
    );
  }

  /**
   * Refreshes the chart content
   * @param rawData
   */
  public updateChart(rawData = this.rawData){
    const chartData = this.formatData(rawData);
    this.chartVisible = this.isThereEnoughData(chartData);
    this.loading = false;
    if(this.chartVisible){
      this.comments = chartData;
    }
  }

  /**
   * Checks if theres actually enough results to render a chart
   * @param chartData
   * @returns {boolean}
   */
  private isThereEnoughData(chartData){
    return  (chartData.length > 0);
  }

  private formatData(rawData = this.rawData){
    let comments = [];
    rawData.data.forEach((dateObject)=>{
      let date = dateObject.date;
      dateObject.userResults.forEach((userResult)=>{
        if(userResult.comment != ""){
          comments.push({
              comment: userResult.comment,
              score: userResult.score,
              date: moment(date).format("h a ddd (MMMM Do 'YY)")
            });
        }
      });
    });
    return comments;
  }

}


