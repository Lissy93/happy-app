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

  chart: any;
  rawData: any = {};

  constructor(
    private teamService: TeamService,
    private sharedModule: SharedModule
  ){}

  ngOnInit() {
    this.generateChart();
    this.teamService.sentimentDataUpdated.subscribe(
      (teamSentimentData) => {
        this.rawData = teamSentimentData;
        let chartData = this.makeChartData(this.rawData);
        this.generateChart();
        this.setChartData(chartData)
      }
    );
  }

  makeChartData(rawData){
    let sentimentCount = {};
    rawData.data.forEach((dateSet)=>{
      dateSet.userResults.forEach((userResult)=>{
        let sentiment = userResult.score;
        if(sentimentCount[sentiment]){sentimentCount[sentiment]++}
        else{sentimentCount[sentiment] = 1}
      })
    });

    let chartData = [];
    Object.keys(sentimentCount).forEach((sentimentName)=>{
      chartData.push([sentimentName, sentimentCount[sentimentName]]);
    });

    return chartData;

  }

  generateChart(){
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

  setChartData(chartData){
    this.chart.load({
      columns: chartData
    });
  }

  showByToday(){

    let sharedModule = this.sharedModule;

    /**
     * Determines if given timestamp was since midnight, today
     */
    function isToday(then){
      return sharedModule.getNumDaysFromDate(then) == 0;
    }

    let newUserData = [];
    this.rawData.data.forEach((dateSet)=>{
      if(isToday(dateSet.date)){
        newUserData.push(dateSet)
      }
    });
    this.rawData.data = newUserData;
    this.setChartData(this.makeChartData(this.rawData));
    }

  showByWeek(){

  }

  showByMonth(){

  }

}
