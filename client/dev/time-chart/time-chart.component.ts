import {Component, OnInit} from "@angular/core";
declare const c3, d3;

@Component({
  selector: "time-chart",
  templateUrl: "time-chart/time-chart.html",
  styleUrls: ["time-chart/time-chart.css"]
})

export class TimeChartComponent implements OnInit {

  chart: any;

  ngOnInit(): void {
    this.generateChart();
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
          categories: ['Mon 15', 'Tue 16', 'Wed 17', 'Thur 18', 'Fri 19', 'Mon 22', 'Tue 23', 'Wed 24', 'Thur 25']
        }
      }
    });

    this.showMultiLines();
  }

  private showSingleLine(){
    this.chart.load({
      columns: [
        ['overall',    1, 1, 4, 6, 8, 4, 4, 10, 13]
      ],
      unload: ['good', 'average', 'bad']
  });
  }

  private showMultiLines(){
    this.chart.load({
      columns: [
        ['good',    1, 1, 4, 6, 8, 4, 4, 10, 13],
        ['average', 6, 7, 6, 5, 3, 5, 4, 3, 2],
        ['bad',     8, 7, 5, 4, 3, 6, 7, 2, 0]
      ],
      unload: ['overall']
    })

  }

}


