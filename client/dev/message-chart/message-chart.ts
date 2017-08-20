import {Component, OnInit} from "@angular/core";
import {TeamService} from "../team.service";
import {SharedModule} from "../shared-helpers.module";
declare const  moment, tippy;

@Component({
  selector: "message-chart",
  templateUrl: "message-chart/message-chart.html",
  styleUrls: ["message-chart/message-chart.css"]
})

export class MessageChartComponent implements OnInit {

  rawData: any = {};      // The returned, un-formatted team data
  chartVisible: boolean;  // If true chart will show
  loading: boolean = true;// Show to loading spinner

  constructor(
    private teamService: TeamService,
    private sharedModule: SharedModule
  ){}

  ngOnInit(): void {
    this.teamService.sentimentDataUpdated.subscribe(
      (teamSentimentData) => {
        this.rawData = teamSentimentData;
        setTimeout(()=>{ this.updateChart(teamSentimentData); }, 1000)
      }
    );
  }

  /**
   * Refreshes the chart content
   * @param rawData
   */
  public updateChart(rawData = this.rawData){
    let chartData = [];
    this.chartVisible = this.isThereEnoughData(chartData);
    this.loading = false;
    if(this.chartVisible){
      this.renderChart(chartData);
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


  /**
   * Renders the chart
   * @param data
   */
  private renderChart(data){


  }


}


