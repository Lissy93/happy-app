import { Component, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import {TeamService} from "../../services/team.service";
import {SharedModule} from "../../shared-helpers.module";
declare const d3, moment, tippy;

@Component({
  selector: "time-chart",
  templateUrl: "./components/time-chart/time-chart.html",
  styleUrls: ["./components/time-chart/time-chart.css"]
})

export class TimeChartComponent implements OnInit, OnDestroy {

  chart: any;             // Stores the actual C3 chart
  rawData: any = {};      // The returned, un-formatted team data
  chartVisible: boolean;  // If true chart will show
  loading: boolean = true;// Show to loading spinner
  typeOfChart: string = 'breakdown'; // 'breakdown' | 'aggregate'
  ngUnsubscribe: Subject<void> = new Subject<void>(); // Used for better unsubscribing

  constructor(
      private teamService: TeamService,
      private sharedModule: SharedModule
  ){}

  ngOnInit(): void {
    this.teamService.sentimentDataUpdated .takeUntil(this.ngUnsubscribe).subscribe(
        (teamSentimentData) => {
          this.rawData = teamSentimentData;
         this.updateChart(teamSentimentData);
        }
    );
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Refreshes the chart content
   * @param rawData
   */
  public updateChart(rawData = this.rawData){
    this.removeOldChart();
    let chartData = [];
    if(this.typeOfChart == 'breakdown'){ chartData = this.showMultiLines(rawData); }
    else{ chartData = this.showSingleLine(rawData); }
    this.chartVisible = this.isThereEnoughData(chartData);
    this.loading = false;
    if(this.chartVisible){
      this.renderChart(chartData);
    }
  }

  /**
   * Called when aggregate or breakdown is clicked
   * @param newChartType
   */
  public changeChartType(newChartType?){
    if(newChartType){this.typeOfChart = newChartType;}
    this.removeOldChart();
    this.loading = true;
    setTimeout(()=>{ this.updateChart(); }, 400)
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
   * Does what it says on the tin really
   */
  private removeOldChart(){
    d3.select("#time-chart").select('svg').remove();
  }


  /**
   * Renders the chart
   * @param data
   */
  private renderChart(data){

    let parent = d3.select("#time-chart"); // Get parent
    let svgWidth = parseInt(parent.style("width"));
    let svgHeight = 300;

    let svg = parent.append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const margin = {top: 20, right: 80, bottom: 35, left: 50};
    const width = svg.attr("width") - margin.left - margin.right;
    const height = svg.attr("height") - margin.top - margin.bottom;


    const parseTime = d3.timeParse("%Y%m%d");
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const z = d3.scaleOrdinal()
      .domain(['good', 'average', 'bad'])
      .range(["#4DC54E", "#D3D030", "#BB5337"]);

    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.temperature); });

    let values = [];
    if (this.typeOfChart == 'breakdown'){
      values = ['good', 'average', 'bad']
    }
    else{
      values = ['overall']
    }

      let cities = values.map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {date: d.date, temperature: d[id]};
          })
        };
      });

      x.domain(d3.extent(data, function(d) { return d.date; }));

      y.domain([
        d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
        d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
      ]);

      z.domain(cities.map(function(c) { return c.id; }));

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Score");

      var city = g.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");

      city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); })
        .attr('title', (d)=> { return d.id; })
        .on('mouseover', function (d, i ) {
          tippy(this, {arrow: false, followCursor: true, position: 'bottom'});
          d3.select(this).style("stroke-width", 2.5);
        })
        .on('mouseout', function (d, i ) {
          d3.select(this).style("stroke-width", 1.5);
        });


      city.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
        .attr("x", width)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.id; });

    function type(d, _, columns) {
      d.date = parseTime(d.date);
      for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
      return d;
    }

  }

  /**
   * Shows 1 single line, as an aggregate summary of overall sentiment
   * @param rawData
   */
  private showSingleLine(rawData = this.rawData){
    let sentimentResults = []; // Will store final chart data
    const sentimentPerDay = this.sharedModule.getSentimentCountPerDay(rawData);
    const labels = this.sharedModule.getAllLabels(rawData); // good, bad....

    Object.keys(sentimentPerDay).forEach((date)=>{
      let newObject = {};
      let dayScore = 0;
      labels.forEach((label)=>{
        let labelScore = this.sharedModule.convertLabelToValue(label);
        dayScore += (labelScore * sentimentPerDay[date][label]);
        newObject['overall'] =  (isNaN(dayScore)? 0 : dayScore );
      });
      newObject['date']= moment(date).valueOf();
      sentimentResults.push(newObject);
    });
    return sentimentResults;
  }

  /**
   * Displays a line for each sentiment-label on the chart
   * @param rawData
   */
  private showMultiLines(rawData = this.rawData){
    let sentimentResults = []; // Will store final chart data
    const sentimentPerDay = this.sharedModule.getSentimentCountPerDay(rawData);
    const labels = this.sharedModule.getAllLabels(rawData); // good, bad....

    Object.keys(sentimentPerDay).forEach((date)=>{
      let newObject = {};
      labels.forEach((label)=>{
        newObject[label] = (sentimentPerDay[date][label]? sentimentPerDay[date][label] : 0);
      });
      newObject['date']= moment(date).valueOf();
      sentimentResults.push(newObject);
    });

    return sentimentResults;
  }

  /**
   * Called when window is resized.
   * Updating the chart was easier than trying to make it responsive...
   * @param event
   */
  public onWindowResize(event){
    let resizeTimer = undefined;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      return resizeTimer = setTimeout((() =>
        this.updateChart() ), 250);
    });
  }

}


