import {
  Component,
  OnInit
} from "@angular/core";
import {TeamService} from "../team.service";
import {SharedModule} from "../shared-helpers.module";

declare const c3, d3;

@Component({
  selector: "overview-chart",
  templateUrl: "overview-chart/overview-chart.html",
  styleUrls: ["overview-chart/overview-chart.css"]
})
export class OverviewChartComponent implements OnInit {

  chart: any; // Stores the actual C3 chart
  rawData: any = {}; // The returned, un-formatted team data
  chartVisible: boolean; // If true chart will show

  constructor(
    private teamService: TeamService,
    private sharedModule: SharedModule
  ){}

  ngOnInit() {
    this.generateChart();
    this.teamService.sentimentDataUpdated.subscribe(
      (teamSentimentData) => {
        this.rawData = teamSentimentData;
        this.generateChart();
        this.updateChart();
      }
    );
  }

  updateChart(rawData = this.rawData){
    const chartData = this.makeChartData(rawData);
    this.chartVisible = this.isThereEnoughData(chartData);
    if(this.chartVisible){
      this.setChartData(chartData);
    }
  }

  private isThereEnoughData(chartData){
    return chartData.length > 0;
  }

  private makeChartData(rawData){
    const sentimentCount = this.sharedModule.getOverallSentimentCount(rawData);

    let chartData = [];
    Object.keys(sentimentCount).forEach((sentimentName)=>{
      chartData.push([sentimentName, sentimentCount[sentimentName]]);
    });
    return chartData;

  }


  private generateChart(){
    this.chart = c3.generate({
      bindto: '#overview-chart',
      data: {
        columns: [], type : 'donut',
        colors: {
            good: '#4DC54E', average: '#D3D030', bad: '#BB5337'
        }
      },
      donut: { title: "" }
    });
  }

  private setChartData(chartData){
    this.chart.load({
      columns: chartData
    });
  }

  private showLastXDays(xDays){
    this.updateChart(this.sharedModule.showLastXDays(this.rawData, xDays));
  }

  private showLodader(){

  }

  showByToday(){
    this.showLastXDays(0);
  }

  showByWeek(){
    this.showLastXDays(7);
  }

  showByMonth(){
    this.showLastXDays(30);
  }

}
