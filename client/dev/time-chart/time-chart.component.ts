import {Component, OnInit} from "@angular/core";
import {TeamService} from "../team.service";
import {SharedModule} from "../shared-helpers.module";
declare const d3, moment, tippy;

@Component({
  selector: "time-chart",
  templateUrl: "time-chart/time-chart.html",
  styleUrls: ["time-chart/time-chart.css"]
})

export class TimeChartComponent implements OnInit {

  chart: any;             // Stores the actual C3 chart
  rawData: any = {};      // The returned, un-formatted team data
  chartVisible: boolean;  // If true chart will show
  loading: boolean = true;

  constructor(
      private teamService: TeamService,
      private sharedModule: SharedModule
  ){}

  ngOnInit(): void {
    this.teamService.sentimentDataUpdated.subscribe(
        (teamSentimentData) => {
          this.rawData = teamSentimentData;
          setTimeout(()=>{ this.updateChart(teamSentimentData); }, 1000)
        }
    );
  }

  private updateChart(rawData = this.rawData){

        this.removeOldChart();

    const chartData = this.makeChartData(rawData);
    this.chartVisible = this.isThereEnoughData(chartData);
    this.loading = false;
    if(this.chartVisible){
      this.renderChart(this.makeChartData(rawData));
    }
    else{
      this.removeOldChart();
    }

  }

  private makeChartData(rawData = this.rawData){
    return this.showMultiLines(rawData);
  }

  private isThereEnoughData(chartData){
    return true;
  }

  private removeOldChart(){
    d3.select("#time-chart").select('svg').remove();
  }

  /**
   * Returns an array of every date with results, all formatted for the chart
    * @param rawData
   * @returns {Array}
   */
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

  private renderChart(data){

    console.log(data);

    // data = [{"date":20111001,"good":63.4,"average":62.7,"bad":72.2},{"date":20111002,"good":58,"average":59.9,"bad":67.7},{"date":20111003,"good":53.3,"average":59.1,"bad":69.4},{"date":20111004,"good":55.7,"average":58.8,"bad":68},{"date":20111005,"good":64.2,"average":58.7,"bad":72.4},{"date":20111006,"good":58.8,"average":57,"bad":77},{"date":20111007,"good":57.9,"average":56.7,"bad":82.3},{"date":20111008,"good":61.8,"average":56.8,"bad":78.9},{"date":20111009,"good":69.3,"average":56.7,"bad":68.8},{"date":20111010,"good":71.2,"average":60.1,"bad":68.7},{"date":20111011,"good":68.7,"average":61.1,"bad":70.3},{"date":20111012,"good":61.8,"average":61.5,"bad":75.3},{"date":20111013,"good":63,"average":64.3,"bad":76.6},{"date":20111014,"good":66.9,"average":67.1,"bad":66.6},{"date":20111015,"good":61.7,"average":64.6,"bad":68},{"date":20111016,"good":61.8,"average":61.6,"bad":70.6},{"date":20111017,"good":62.8,"average":61.1,"bad":71.1},{"date":20111018,"good":60.8,"average":59.2,"bad":70},{"date":20111019,"good":62.1,"average":58.9,"bad":61.6},{"date":20111020,"good":65.1,"average":57.2,"bad":57.4},{"date":20111021,"good":55.6,"average":56.4,"bad":64.3},{"date":20111022,"good":54.4,"average":60.7,"bad":72.4},{"date":20111023,"good":54.4,"average":65.1,"bad":72.4},{"date":20111024,"good":54.8,"average":60.9,"bad":72.5},{"date":20111025,"good":57.9,"average":56.1,"bad":72.7},{"date":20111026,"good":54.6,"average":54.6,"bad":73.4},{"date":20111027,"good":54.4,"average":56.1,"bad":70.7},{"date":20111028,"good":42.5,"average":58.1,"bad":56.8},{"date":20111029,"good":40.9,"average":57.5,"bad":51},{"date":20111030,"good":38.6,"average":57.7,"bad":54.9},{"date":20111031,"good":44.2,"average":55.1,"bad":58.8},{"date":20111101,"good":49.6,"average":57.9,"bad":62.6},{"date":20111102,"good":47.2,"average":64.6,"bad":71},{"date":20111103,"good":50.1,"average":56.2,"bad":58.4},{"date":20111104,"good":50.1,"average":50.5,"bad":45.1},{"date":20111105,"good":43.5,"average":51.3,"bad":52.2},{"date":20111106,"good":43.8,"average":52.6,"bad":73},{"date":20111107,"good":48.9,"average":51.4,"bad":75.4},{"date":20111108,"good":55.5,"average":50.6,"bad":72.1},{"date":20111109,"good":53.7,"average":54.6,"bad":56.6},{"date":20111110,"good":57.7,"average":55.6,"bad":55.4},{"date":20111111,"good":48.5,"average":53.9,"bad":46.7},{"date":20111112,"good":46.8,"average":54,"bad":62},{"date":20111113,"good":51.1,"average":53.8,"bad":71.6},{"date":20111114,"good":56.8,"average":53.5,"bad":75.5},{"date":20111115,"good":59.7,"average":53.4,"bad":72.1},{"date":20111116,"good":56.5,"average":52.2,"bad":65.7},{"date":20111117,"good":49.6,"average":52.7,"bad":56.8},{"date":20111118,"good":41.5,"average":53.1,"bad":49.9},{"date":20111119,"good":44.3,"average":49,"bad":71.7},{"date":20111120,"good":54,"average":50.4,"bad":77.7},{"date":20111121,"good":54.1,"average":51.1,"bad":76.4},{"date":20111122,"good":49.4,"average":52.3,"bad":68.8},{"date":20111123,"good":50,"average":54.6,"bad":57},{"date":20111124,"good":44,"average":55.1,"bad":55.5},{"date":20111125,"good":50.3,"average":51.5,"bad":61.6},{"date":20111126,"good":52.1,"average":53.6,"bad":64.1},{"date":20111127,"good":49.6,"average":52.3,"bad":51.1},{"date":20111128,"good":57.2,"average":51,"bad":43},{"date":20111129,"good":59.1,"average":49.5,"bad":46.4},{"date":20111130,"good":50.6,"average":49.8,"bad":48},{"date":20111201,"good":44.3,"average":60.4,"bad":48.1},{"date":20111202,"good":43.9,"average":62.2,"bad":60.6},{"date":20111203,"good":42.1,"average":58.3,"bad":62.6},{"date":20111204,"good":43.9,"average":52.7,"bad":57.1},{"date":20111205,"good":50.2,"average":51.5,"bad":44.2},{"date":20111206,"good":54.2,"average":49.9,"bad":37.4},{"date":20111207,"good":54.6,"average":48.6,"bad":35},{"date":20111208,"good":43.4,"average":46.4,"bad":37},{"date":20111209,"good":42.2,"average":49.8,"bad":45.4},{"date":20111210,"good":45,"average":52.1,"bad":50.7},{"date":20111211,"good":33.8,"average":48.8,"bad":48.6},{"date":20111212,"good":36.8,"average":47.4,"bad":52.2},{"date":20111213,"good":38.6,"average":47.2,"bad":60.8},{"date":20111214,"good":41.9,"average":46.1,"bad":70},{"date":20111215,"good":49.6,"average":48.8,"bad":64.2},{"date":20111216,"good":50.2,"average":47.9,"bad":50.9},{"date":20111217,"good":40.6,"average":49.8,"bad":51.6},{"date":20111218,"good":29.1,"average":49.1,"bad":55.2},{"date":20111219,"good":33.7,"average":48.3,"bad":62.1},{"date":20111220,"good":45.8,"average":49.3,"bad":56.3},{"date":20111221,"good":47.4,"average":48.4,"bad":47.2},{"date":20111222,"good":54.4,"average":53.3,"bad":52.3},{"date":20111223,"good":47.8,"average":47.5,"bad":45.2},{"date":20111224,"good":34.9,"average":47.9,"bad":43.6},{"date":20111225,"good":35.9,"average":48.9,"bad":42.9},{"date":20111226,"good":43.6,"average":45.9,"bad":48.2}];

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

      let cities = ['good',	'average',	'bad'].map(function(id) {
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
        .attr("d", function(d) { console.log(d); return line(d.values); })
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

    let sentimentResults = ['overall']; // Will store final chart data
    const sentimentPerDay = this.sharedModule.getSentimentCountPerDay(rawData);

    // Get sentiment data into the right format for the C3 chart
    Object.keys(sentimentPerDay).forEach((date)=>{ // For each day of data...
        let dayScore = 0;
        Object.keys(sentimentPerDay[date]).forEach((label)=>{
          let labelScore = this.sharedModule.convertLabelToValue(label);
          dayScore += (labelScore * sentimentPerDay[date][label]);
        });
        sentimentResults.push(String(dayScore));
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

  public onWindowResize(event){
    let resizeTimer = undefined;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      return resizeTimer = setTimeout((() =>
        this.updateChart() ), 250);
    });
  }

}


