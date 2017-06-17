import {Component, OnInit} from "@angular/core";
import {TeamService} from "../team.service";
import {SharedModule} from "../shared-helpers.module";
declare const c3, d3;

@Component({
  selector: "time-chart",
  templateUrl: "time-chart/time-chart.html",
  styleUrls: ["time-chart/time-chart.css"]
})

export class TimeChartComponent implements OnInit {

  chart: any;             // Stores the actual C3 chart
  rawData: any = {};      // The returned, un-formatted team data
  chartVisible: boolean;  // If true chart will show

  constructor(
      private teamService: TeamService,
      private sharedModule: SharedModule
  ){}

  ngOnInit(): void {
    this.teamService.sentimentDataUpdated.subscribe(
        (teamSentimentData) => {
          this.rawData = teamSentimentData;
          this.generateChart();
          this.updateChart([]);
        }
    );
  }

  private makeAxisData(rawData = this.rawData){
    let dateResults = [];
    Object.keys(this.sharedModule.getSentimentCountPerDay(this.rawData)).forEach((date)=> {
      dateResults.push(date);
    });
    return dateResults;
  }

  private generateChart(){

    this.chart =  c3.generate({
      bindto: '#time-chart',
      data: {
        columns: []
      },
      color: {
        pattern: ['#4DC54E', '#D3D030', '#BB5337']
      },
      axis: {
        x: {
          type: 'category',
          categories: this.makeAxisData()
        }
      }
    });

    this.showMultiLines();
  }

  private updateChart(chartData){
    this.chart.load({
      columns: [
        ['overall',    1, 1, 4, 6, 8, 4, 4, 10, 13]
      ],
      unload: ['good', 'average', 'bad']
    });
  }

  private showSingleLine(){
    this.chart.load({
      columns: [
        ['overall',    1, 1, 4, 6, 8, 4, 4, 10, 13]
      ],
      unload: ['good', 'average', 'bad']
  });
  }

  /**
   * Displays a line for each sentiment-label on the chart
   * @param rawData
   */
  private showMultiLines(rawData = this.rawData){
    let sentimentResults = []; // Will store final chart data
    const sentimentPerDay = this.sharedModule.getSentimentCountPerDay(rawData);
    const labels = this.sharedModule.getAllLabels(rawData); // good, bad....
    labels.forEach((label)=> sentimentResults.push([label])); // Initialise

    // Get sentiment data into the right format for the C3 chart
    Object.keys(sentimentPerDay).forEach((date)=>{ // For each day of data...
        labels.forEach((label)=>{ // For each label (e.g. good, average, bad)...
          sentimentResults.forEach((sentimentResult)=>{
            if(sentimentResult[0] == label){ // (First value of arr is the label)
              if(!sentimentPerDay[date][label]) sentimentResult.push(0);
              else sentimentResult.push(sentimentPerDay[date][label]);
            }
          })
        })

    });

    // Load the new data into the chart :)
    this.chart.load({
      columns: sentimentResults,
      unload: ['overall']
    });
  }

}


