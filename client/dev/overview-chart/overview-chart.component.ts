import {
  Component,
  OnInit
} from "@angular/core";
declare const c3, d3;

@Component({
  selector: "overview-chart",
  templateUrl: "overview-chart/overview-chart.html",
  styleUrls: ["overview-chart/overview-chart.css"]
})
export class OverviewChartComponent implements OnInit {

  chart: any;

  ngOnInit() {
    this.generateChart();
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
    this.showByToday();
  }

  showByToday(){
    this.chart.load({
      columns: [
        ['good', 8],
        ['average', 4],
        ['bad', 3],
      ]
    });
  }

  showByWeek(){
    this.chart.load({
      columns: [
        ['good', 32],
        ['average', 22],
        ['bad', 5],
      ]
    });
  }

  showByMonth(){
    this.chart.load({
      columns: [
        ['good', 310],
        ['average', 45],
        ['bad', 25],
      ]
    });
  }

}
