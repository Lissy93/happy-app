import {Component } from '@angular/core';
import { SharedModule } from '../shared-helpers.module';
import { AllTeamsService } from '../all-teams.service';
import {CommonService} from "../common.service";

declare const d3, tippy;

@Component({
  selector: 'grid-chart',
  templateUrl: 'grid-chart/grid-chart.html',
  styleUrls: ['grid-chart/grid-chart.css']
})

export class GridChartComponent {

  gridChartData: object[];
  showChart: boolean = true;

  constructor(
    private allTeamsService: AllTeamsService,
    private sharedModule: SharedModule,
    private commonService: CommonService
  ){

    // Get raw summary data, and keep up-to-date
    this.allTeamsService.teamDataUpdated.subscribe(
      (teamData) => {
        this.gridChartData  = this.sharedModule.getAverageDaySentiment(teamData);
        if(this.checkThereIsEnoughData(teamData)){ // If there is enough data for chart
          this.drawTheChart(this.gridChartData); // Then call to render the chart
        }
        else{
          this.showChart = false; // Else hide chart, and show message
        }
      }
    );
  }

  /**
   * Checks that there is enough data to display the chart
   * @param rawData
   * @returns {boolean}
   */
  private checkThereIsEnoughData(rawData){
      return rawData.length > 0;
  }

  /**
   * Generates and renders the D3 calendar-grid chart!
   * @param dateData
   */
  drawTheChart(dateData){

      /* Got to change the date formats, to make it easier with D3 */
      dateData.forEach((obj, index)=>{
          dateData[index].date = new Date(obj.date).toISOString().substring(0, 10);
      });

      /* Calc number of weeks for given month */
      const weeksInMonth = (month)=>{
        let m = d3.timeMonth.floor(month);
        return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
      };

      /* Specify dimensions for grid */
      const cellMargin = 2;
      const cellSize = 25;

      /* Get date range */
      const minDate =
        d3.min(dateData, (d) => { return new Date(d.date).getTime() });
      const maxDate =
        d3.max(dateData, (d) => { return new Date(d.date).getTime() });

      /* Specify D3 date/ time formats */
      const day = d3.timeFormat('%w');
      const week = d3.timeFormat('%U');
      const format = d3.timeFormat('%Y-%m-%d');
      const titleFormat = d3.utcFormat('%A, %d-%b');
      const monthName = d3.timeFormat('%B');
      const months = d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

    /* Define colour scale (red, to yellow, to green) for score */
    const colorScale = d3.scaleLinear()
      .domain([-1, -0.7, -0.5, -0.3, 0, 0.3, 0.5, -.7, 1])
      .range(
        ['#bb5337', '#c06537', '#c47638', '#c88737',  // negative
          '#bdce37',                                    // neutral
          '#8dca44', '#7bc947', '#66c74b', '#4dc54e']); // positive

      /* Create SVG, set data, and pass in basic layout attributes */
      let svg = d3.select('#grid-chart').selectAll('svg')
        .data(months)
        .enter().append('svg')
        .attr('class', 'month')
        .attr('height', ((cellSize * 7) + (cellMargin * 8) + 20) )
        .attr('width', (d) => {
          let columns = weeksInMonth(d);
          return ((cellSize * columns) + (cellMargin * (columns + 1)));
        })
        .append('g');

      /* Append month names */
      svg.append('text')
        .attr('class', 'month-name')
        .attr('y', (cellSize * 7) + (cellMargin * 8) + 15 )
        .attr('x', (d) => {
          let columns = weeksInMonth(d);
          return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
        })
        .attr('text-anchor', 'middle')
        .text((d) => { return monthName(d); });

      /* Append a square for each day */
      let rect = svg.selectAll('rect.day')
        .data((d) => {
          return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1));
        })
        .enter().append('rect')
        .attr('class', 'day')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('rx', 2).attr('ry', 2) // rounded corners
        .attr('fill', '#eaeaea') // default light grey fill
        .attr('y', (d) => { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
        .attr('x', (d) => { return +
                ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) +
                ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) +
                cellMargin ;
        })
        .on('mouseover', function (d, i ) {
          d3.select(this).classed('hover', true);
          tippy(this, {arrow: true, animation: 'fade', followCursor: true, position: 'left', size: 'small'});
        })
        .on('mouseout', function() {
          d3.select(this).classed('hover', false);
        })
        .on('click', (d)=> this.updateDaySummary(d) )
        .datum(format);

      /* Set hover title for each day */
      rect.attr('title',(d) => { return `${titleFormat(new Date(d))} [no data yet]`; });

      /* Get score (called count) from given date */
      let lookup = d3.nest()
        .key((d) => { return d.date })
        .rollup((leaves) => {
          return d3.sum(leaves, (d) => {
            return Math.round(parseFloat(d.count)*1000)/1000;
          });
        })
        .object(dateData);

      /* Set the fill, and the title for the squares with valid data */
      rect.filter((d) => { return d in lookup; })
        .style('fill', function(d) { return colorScale(lookup[d]); })
        .attr('title', (d) => {
          return  `${titleFormat(new Date(d))}: `+
            `${this.sharedModule.getPercentagePositive(lookup[d])}`+
            `% Positive`;
        });

    this.showChart = true; // Should be true
  }

  /**
   * Calls a function in the day-summary component, to show detailed day data
   * @param date
   */
  updateDaySummary(date){
    this.commonService.notifyDateSquareClicked(date);
  }
}
