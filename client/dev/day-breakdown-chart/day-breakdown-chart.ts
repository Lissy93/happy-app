import {Component, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import { SharedModule } from '../shared-helpers.module';
import { AllTeamsService } from '../all-teams.service';
import {CommonService} from "../common.service";
import {Subscription} from "rxjs";
import {Http} from "@angular/http";

declare const d3, tippy, moment;

@Component({
  selector: 'day-breakdown-chart',
  templateUrl: 'day-breakdown-chart/day-breakdown-chart.html',
  styleUrls: ['day-breakdown-chart/day-breakdown-chart.css']
})

export class DayBreakdownChartComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  date: Date;
  dateData: Object;
  formatedDate: String = '';
  noDataMessage: String = '';
  showChart: Boolean = true;

  dateDataUpdated: EventEmitter<any> = new EventEmitter();


  constructor(
    private http: Http,
    private commonService: CommonService,
    private sharedModule: SharedModule
  ){}

  ngOnInit() {

    // Subscribe to listen for new date change
    this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
      this.date = res; // Set date in class
      this.fetchDateTeamData(this.date); // Initiate the fetching of new date data
      this.formatedDate = this.sharedModule.makeFormattedDate(this.date)
    });

    // Subscribe to listen for when new date data comes in
    this.dateDataUpdated.subscribe(
      (rawDateData) => { this.renderChart(rawDateData); }
    );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private fetchDateTeamData(date){
    this.http.get('/api/date/'+date)
      .map(res => res.json())
      .subscribe(dateData => {
          this.dateData = dateData;
          this.dateDataUpdated.emit(this.dateData);
        }
      );
  }

  private renderChart(rawDateData){

    /* Format the data for the chart */
    const data = this.makeChartData(rawDateData);

    /* Reset the SVG */
    d3.select("#bar-chart svg").remove(); // Remove old SVG
    let parent = d3.select("#bar-chart"); // Get parent
    let svg = parent.append("svg"); // Add new SVG

    if(data.length == 0){
      this.showNoDataMessage(this.date);
      return false;
    }
    else{ // We assume there is valid data for today:
      this.showChart = true;
    }

    /* Set dimensions */
    let margin = { top: 20, right: 60, bottom: 30, left: 40 };
    let width = parseInt(parent.style("width")) - margin.left - margin.right;
    let height = parseInt(parent.style("height")) - margin.top - margin.bottom;
    svg.attr("width", width+40).attr("height", height+40);
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /* Define scales */
    const y = d3.scaleBand()
      .rangeRound([0, height])
      .padding(0.1)
      .align(0.1);

    const x = d3.scaleLinear()
      .rangeRound([0, width]);

    const z = d3.scaleOrdinal()
      .range(["#4DC54E", "#D3D030", "#BB5337"]);

    /* Sort data by highest total first */
    data.sort(function(a, b) { return b['total'] - a['total']; });

    /* Map the data against domains */
    y.domain(data.map(function(d) {
      return d.teamName;
    }));
    z.domain(["good", "average", "bad"]);
    x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();

    /* Create the serries */
    const series = g.selectAll(".serie")
      .data(d3.stack().keys(["good", "average", "bad"])(data))
      .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) {
        return z(d.key);
      });

    series.selectAll("rect")
      .data(function(d) {
        return d;
      })
      .enter().append("rect")
      .attr("y", function(d) {
        return y(d.data.teamName);
      })
      .attr("x", function(d) {
        return x(d[0]);
      })
      .attr("width", function(d) {
        const w = x(d[1]) - x(d[0]);
        if(isNaN(w)){return 0; }
        return w;
      })
      .attr("height", y.bandwidth());

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(width/30));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

    const legend = series.append("g")
      .attr("class", "legend")
      .attr("transform", function(d) {
        d = d[0];
        if(!d){ return 0; }
        return "translate(" +  ((x(d[0]) + x(d[1])) / 2) + ", " +(y(d.data.teamName) - y.bandwidth())+ ")";
      });

    function type(d, i, columns) {
      let t = 0;
      for (let i = 1; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
      d.total = t;
      return d;
    }
  }

  private makeChartData(rawData){

    function formatData(data){
      let newData = [];
      data.forEach((barObject)=>{

        let total = 0;
        Object.keys(barObject.scores).forEach((key)=>{
          total += barObject.scores[key];
        });

        let newBarObject = barObject.scores;
        newBarObject['teamName'] = barObject.teamName;
        newBarObject.total = total;
        newData.push(newBarObject);
      });

      return newData;
    }

    let chartData = [];
    rawData.forEach((teamObject)=>{
      let bar = {};
      let scores = this.sharedModule.getOverallSentimentCount(teamObject);
      bar['teamName'] = teamObject.teamName;
      bar['scores'] = scores;
      chartData.push(bar);
    });

    return formatData(chartData);

  }

  private showNoDataMessage(date){
    this.showChart = false;
    this.noDataMessage = `No data recorded for ${this.sharedModule.makeFormattedDate(date)}`
  }



}
