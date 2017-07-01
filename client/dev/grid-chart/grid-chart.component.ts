import {Component, OnInit} from "@angular/core";
import {SharedModule} from "../shared-helpers.module";
import {AllTeamsService} from "../all-teams.service";

declare const c3, d3;

@Component({
  selector: "grid-chart",
  templateUrl: "grid-chart/grid-chart.html",
  styleUrls: ["grid-chart/grid-chart.css"]
})
export class GridChartComponent implements OnInit{

  teamSummaryData: object[];

  constructor(
    private allTeamsService: AllTeamsService,
    private sharedModule: SharedModule
  ){

    // Get raw summary data, and keep up-to-date
    this.teamSummaryData = this.allTeamsService.getTeamSummary();
    this.allTeamsService.teamDataUpdated.subscribe(
      (teamData) => { this.teamSummaryData  = teamData; }
    );
  }


  ngOnInit(): void {


    const fakeData = [
      {
        "day": "2016-05-12",
        "count": 171
      },
      {
        "day": "2016-06-17",
        "count": 139
      },
      {
        "day": "2016-05-02",
        "count": 556
      },
      {
        "day": "2016-04-10",
        "count": 1
      },
      {
        "day": "2016-05-04",
        "count": 485
      },
      {
        "day": "2016-03-27",
        "count": 1
      },
      {
        "day": "2016-05-26",
        "count": 42
      },
      {
        "day": "2016-05-25",
        "count": 337
      },
      {
        "day": "2016-05-23",
        "count": 267
      },
      {
        "day": "2016-05-05",
        "count": 569
      },
      {
        "day": "2016-03-31",
        "count": 32
      },
      {
        "day": "2016-03-25",
        "count": 128
      },
      {
        "day": "2016-05-13",
        "count": 221
      },
      {
        "day": "2016-03-30",
        "count": 26
      },
      {
        "day": "2016-03-15",
        "count": 3
      },
      {
        "day": "2016-04-24",
        "count": 10
      },
      {
        "day": "2016-04-27",
        "count": 312
      },
      {
        "day": "2016-03-20",
        "count": 99
      },
      {
        "day": "2016-05-10",
        "count": 358
      },
      {
        "day": "2016-04-01",
        "count": 15
      },
      {
        "day": "2016-05-11",
        "count": 199
      },
      {
        "day": "2016-07-06",
        "count": 744
      },
      {
        "day": "2016-05-08",
        "count": 23
      },
      {
        "day": "2016-03-28",
        "count": 98
      },
      {
        "day": "2016-03-29",
        "count": 64
      },
      {
        "day": "2016-04-30",
        "count": 152
      },
      {
        "day": "2016-03-21",
        "count": 148
      },
      {
        "day": "2016-03-19",
        "count": 20
      },
      {
        "day": "2016-05-07",
        "count": 69
      },
      {
        "day": "2016-04-29",
        "count": 431
      },
      {
        "day": "2016-04-25",
        "count": 330
      },
      {
        "day": "2016-04-28",
        "count": 353
      },
      {
        "day": "2016-04-18",
        "count": 9
      },
      {
        "day": "2016-01-10",
        "count": 1
      },
      {
        "day": "2016-01-09",
        "count": 2
      },
      {
        "day": "2016-03-26",
        "count": 21
      },
      {
        "day": "2016-05-27",
        "count": 18
      },
      {
        "day": "2016-04-19",
        "count": 10
      },
      {
        "day": "2016-04-06",
        "count": 1
      },
      {
        "day": "2016-04-12",
        "count": 214
      },
      {
        "day": "2016-05-03",
        "count": 536
      },
      {
        "day": "2016-07-03",
        "count": 3
      },
      {
        "day": "2016-06-16",
        "count": 1
      },
      {
        "day": "2016-03-24",
        "count": 138
      },
      {
        "day": "2016-04-26",
        "count": 351
      },
      {
        "day": "2016-04-23",
        "count": 14
      },
      {
        "day": "2016-05-01",
        "count": 19
      },
      {
        "day": "2016-07-05",
        "count": 523
      },
      {
        "day": "2016-05-22",
        "count": 3
      },
      {
        "day": "2016-05-09",
        "count": 430
      },
      {
        "day": "2016-05-24",
        "count": 472
      },
      {
        "day": "2016-04-11",
        "count": 172
      },
      {
        "day": "2016-03-17",
        "count": 7
      },
      {
        "day": "2016-05-14",
        "count": 10
      },
      {
        "day": "2016-05-06",
        "count": 449
      },
      {
        "day": "2016-07-04",
        "count": 295
      },
      {
        "day": "2016-05-15",
        "count": 12
      },
      {
        "day": "2016-03-23",
        "count": 216
      },
      {
        "day": "2016-03-18",
        "count": 47
      },
      {
        "day": "2016-03-22",
        "count": 179
      }
    ];    this.drawTheChart(fakeData);

  }


  drawTheChart(dateData){

      let weeksInMonth = function(month){
        let m = d3.timeMonth.floor(month);
        return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
      };

      var minDate = d3.min(dateData, function(d) { return new Date(d.day) });
      var maxDate = d3.max(dateData, function(d) { return new Date(d.day) });

      var cellMargin = 2,
        cellSize = 20;

      var day = d3.timeFormat("%w"),
        week = d3.timeFormat("%U"),
        format = d3.timeFormat("%Y-%m-%d"),
        titleFormat = d3.utcFormat("%a, %d-%b");
      let monthName = d3.timeFormat("%B"),
        months= d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

      var svg = d3.select("#grid-chart").selectAll("svg")
        .data(months)
        .enter().append("svg")
        .attr("class", "month")
        .attr("height", ((cellSize * 7) + (cellMargin * 8) + 20) ) // the 20 is for the month labels
        .attr("width", function(d) {
          var columns = weeksInMonth(d);
          return ((cellSize * columns) + (cellMargin * (columns + 1)));
        })
        .append("g")

      svg.append("text")
        .attr("class", "month-name")
        .attr("y", (cellSize * 7) + (cellMargin * 8) + 15 )
        .attr("x", function(d) {
          var columns = weeksInMonth(d);
          return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
        })
        .attr("text-anchor", "middle")
        .text(function(d) { return monthName(d); })

      var rect = svg.selectAll("rect.day")
        .data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 3).attr("ry", 3) // rounded corners
        .attr("fill", '#eaeaea') // default light grey fill
        .attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
        .attr("x", function(d) { return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin ; })
        .on("mouseover", function(d) {
          d3.select(this).classed('hover', true);
        })
        .on("mouseout", function(d) {
          d3.select(this).classed('hover', false);
        })
        .datum(format);

      rect.append("title")
        .text(function(d) { return titleFormat(new Date(d)); });

      var lookup = d3.nest()
        .key(function(d) { return d.day; })
        .rollup(function(leaves) {
          return d3.sum(leaves, function(d){ return parseInt(d.count); });
        })
        .object(dateData);

      var scale = d3.scaleLinear()
        .domain(d3.extent(dateData, function(d) { return parseInt(d.count); }))
        .range([0.4,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme

      rect.filter(function(d) { return d in lookup; })
        .style("fill", function(d) { return d3.interpolatePuBu(scale(lookup[d])); })
        .select("title")
        .text(function(d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });

  }

}
