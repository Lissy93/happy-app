import {
  Component,
  OnInit
} from "@angular/core";
import {TeamService} from "../../services/team.service";
import {SharedModule} from "../../shared-helpers.module";

declare const d3, tippy;

@Component({
  selector: "overview-chart",
  templateUrl: "./components/overview-chart/overview-chart.html",
  styleUrls: ["./components/overview-chart/overview-chart.css"]
})
export class OverviewChartComponent implements OnInit {

  rawData: any = {}; // The returned, un-formatted team data
  chartVisible: boolean; // If true chart will show
  loading: boolean = true;

  constructor(
    private teamService: TeamService,
    private sharedModule: SharedModule
  ){}

  /**
   * On chart initialised, show loader, fetch data, call to render
   */
  ngOnInit() {
    this.loading = true;

    this.teamService.sentimentDataUpdated.subscribe(
      (teamSentimentData) => {
        this.rawData = teamSentimentData;
        this.updateChart();
      }
    );
  }

  /**
   * Called whenever data is modified, re-renders the chart with the new data
   * @param rawData
   */
  updateChart(rawData = this.rawData){
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

  /**
   * Determines if there is enough data to make showing chart worthwhile
   * If not enough data, a message will show instead
   * @param chartData
   * @returns {boolean}
   */
  private isThereEnoughData(chartData){
    return chartData.length > 0;
  }

  /**
   * Generates the chart data, from the raw data that was in mongo
   * @param rawData
   * @returns {Array}
   */
  private makeChartData(rawData){
    let chartData = [];
    const sentimentCount = this.sharedModule.getOverallSentimentCount(rawData);
    Object.keys(sentimentCount).forEach((sentimentName)=>{
      chartData.push({name: sentimentName, value: sentimentCount[sentimentName]})
    });
    return chartData;
  }

  /**
   * You'll never guess.... removeOldChart() removes the old chart
   */
  private removeOldChart(){
    d3.select("#overview-chart").select('svg').remove();
  }


  /**
   * The actual D3 code to render the pie chart!
   * @param chartData
   */
  private renderChart(chartData){

    /* Reset the SVG */
    this.removeOldChart();  // Remove old SVG
    let parent = d3.select("#overview-chart"); // Get parent
    if(parent == null) return; // Okay, somethings gone very wrong, lets not even bother going any further with this...

    /* Dimensions */
    let margin = {top: 10, right: 10, bottom: 10, left: 10};
    let width = parseInt(parent.style("width")) - margin.left - margin.right;
    if(isNaN(width) || width > 300 || width < 0 ){ width = 300; } // width must be valid int, between 0 and 300. Default 300.
    let height = width - margin.top - margin.bottom;

    /* Create the new SVG */
    let svg = d3.select("#overview-chart")
      .append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "center-block")
      .append("g")
      .attr("transform", "translate(" + ((width/2)+margin.left) + "," + ((height/2)+margin.top) + ")");

    let radius = Math.min(width, height) / 2;

    let color = d3.scaleOrdinal()
      .domain(['good', 'average', 'bad'])
      .range(["#4DC54E", "#D3D030", "#BB5337"]);

    let arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius - 35);

    let pie = d3.pie()
      .sort(null)
      .startAngle(1.1*Math.PI)
      .endAngle(3.1*Math.PI)
      .value(function(d) { return d.value; });

    let g = svg.selectAll(".arc")
      .data(pie(chartData))
      .enter().append("g")
      .attr("class", "arc")
      .attr('title', (d)=> makeTitle(d.data))
      .on('mouseover', function (d, i ) {
        tippy(this, {arrow: false, followCursor: true, position: 'bottom', delay: [0, 300]});
      });

    g.append("path")
      .attr("fill", (d)=> { return color(d.data.name); })
      .transition()
      .duration(1000)
      .ease(d3.easeBounce)
      .attrTween("d", (b)=>{
        let i = d3.interpolate({startAngle: 1.1*Math.PI, endAngle: 1.1*Math.PI}, b);
        return function(t) { return arc(i(t)); };
      } );

    function makeTitle(d){
      return `<b style="color: ${color(d.name)}">${d.name}</b> (${d.value} votes)`
    }

  }

  /**
   * Updates the chart with a different set of date data
   * @param xDays
   */
  private showLastXDays(xDays){
    this.updateChart(this.sharedModule.showLastXDays(this.rawData, xDays));
  }

  /**
   * Just shows todays data in the chart
   */
  showByToday(){
    this.showLastXDays(0);
  }

  /**
   * Just shows the last weeks data in the chart
   */
  showByWeek(){
    this.showLastXDays(7);
  }

  /**
   * Just shows the last months data in the chart
   */
  showByMonth(){
    this.showLastXDays(30);
  }

  /**
   * Work-around to make the chart work on all (most) screen sizes
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
