import {
  Component,
  OnInit
} from "@angular/core";
import {TeamService} from "../team.service";
declare const c3, d3;

@Component({
  selector: "overview-chart",
  templateUrl: "overview-chart/overview-chart.html",
  styleUrls: ["overview-chart/overview-chart.css"]
})
export class OverviewChartComponent implements OnInit {

  chart: any;
  rawData: any = {};

  constructor( private teamService: TeamService){}

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
        columns: [],
        type : 'donut',
      },
      color: {
        pattern: ['#4DC54E', '#D3D030', '#BB5337']
      },
      donut: {
        title: ""
      }
    });
  }

  setChartData(chartData){
    this.chart.load({
      columns: chartData
    });
  }

  showByToday(){

  }

  showByWeek(){

  }

  showByMonth(){

  }

}
