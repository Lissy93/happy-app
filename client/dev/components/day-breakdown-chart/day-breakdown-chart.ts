import {Component, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import { SharedModule } from '../../shared-helpers.module';
import {CommonService} from "../../common.service";
import {Subscription} from "rxjs";
import {Http} from "@angular/http";

declare const d3, tippy, moment;

@Component({
  selector: 'day-breakdown-chart',
  templateUrl: 'components/day-breakdown-chart/day-breakdown-chart.html',
  styleUrls: ['components/day-breakdown-chart/day-breakdown-chart.css']
})

export class DayBreakdownChartComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  date: Date;
  dateData: Object;
  formatedDate: String = '';
  noDataMessage: String = '';
  showChart: Boolean = true;
  rawData: Object;
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
      (rawDateData) => {
        this.rawData = rawDateData;
        const chartData = this.makeChartData(rawDateData);

        if(this.checkThereIsEnoughData(chartData)){
          this.renderChart(chartData);
        }
        else{
          this.showNoDataMessage(this.date);
        }
      }
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

  private checkThereIsEnoughData(chartData){
    return chartData.length >= 1;
  }

  private renderChart(data){
    /* Reset the SVG */
    d3.select("#bar-chart svg").remove(); // Remove old SVG
    let parent = d3.select("#bar-chart"); // Get parent
    let svg = parent.append("svg"); // Add new SVG

    /* Ensure there is enough data available */
    if(!this.checkThereIsEnoughData(data)){
      this.showNoDataMessage(this.date);
      return false;
    }
    else{ // We assume there is valid data for the given date
      this.showChart = true;
    }

    /* Set dimensions */
    let margin = { top: 20, right: 20, bottom: 20, left: 35 };
    let width = parseInt(parent.style("width")) - margin.left - margin.right;
    let height = 270;
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

    /* Create the series */
    const series = g.selectAll(".serie")
      .data(d3.stack().keys(["good", "average", "bad"])(data))
      .enter().append("g")
      .attr("class", "serie")
      .attr("fill", (d)=> { return z(d.key); });

    series.selectAll("rect")
      .data((d) => { return d; })
      .enter().append("rect")
      .attr("y", (d) => { return y(d.data.teamName); })
      .attr("x", (d) => { return x(d[0]); })
      .attr("width", function(d) {
        const w = x(d[1]) - x(d[0]);
        if(isNaN(w)){return 0; }
        return w;
      })
      .attr("height", y.bandwidth())
      .attr("title", (d, i)=>{
        return this.getBreakdownText(d.data);
      })
      .on('mouseover', function (d, i ) {
        tippy(this, {arrow: true, animation: 'perspective', followCursor: false, position: 'bottom', size: 'small'});
      });

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
    this.noDataMessage = `No data recorded for ${this.sharedModule.makeFormattedDate(date)}`;
    d3.select("#bar-chart svg").remove();
  }

  private getBreakdownText(barData){
    function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
    return `${capitalize(barData.teamName)}: ${ Math.round(barData.good / barData.total * 100)}% positive (${this.formatedDate})`;
  }


  public onWindowResize(event){
    let resizeTimer = undefined;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      return resizeTimer = setTimeout((() =>
        this.renderChart(this.makeChartData(this.rawData)) ), 250);
    });
  }

}

