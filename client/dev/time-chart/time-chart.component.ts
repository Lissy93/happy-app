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
        }
    );
  }

  private makeAxisData(rawData = this.rawData){
    function formatDate(date) {
      date = new Date(date);
      const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May',
        'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      return `${date.getDate()} ${monthNames[date.getMonth()]}`;
    }

    let dateResults = [];
    Object.keys(this.sharedModule.getSentimentCountPerDay(rawData)).forEach((date)=> {
      dateResults.push(formatDate(date));
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

  private showSingleLine(rawData = this.rawData){

    let sentimentResults = ['overall']; // Will store final chart data
    const sentimentPerDay = this.sharedModule.getSentimentCountPerDay(rawData);

    // Get sentiment data into the right format for the C3 chart
    Object.keys(sentimentPerDay).forEach((date)=>{ // For each day of data...
        let dayScore = 0;
        Object.keys(sentimentPerDay[date]).forEach((label)=>{
          let labelScore = SharedModule.convertLabelToValue(label);
          dayScore += (labelScore * sentimentPerDay[date][label]);
        });
        sentimentResults.push(String(dayScore));
    });

    console.log(sentimentResults);

    this.chart.load({
      columns: [ sentimentResults ],
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
console.log(sentimentResults );
    // Load the new data into the chart :)
    this.chart.load({
      columns: sentimentResults,
      unload: ['overall']
    });
  }

}


