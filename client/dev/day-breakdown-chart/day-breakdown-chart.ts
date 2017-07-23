import {Component, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import { SharedModule } from '../shared-helpers.module';
import { AllTeamsService } from '../all-teams.service';
import {CommonService} from "../common.service";
import {Subscription} from "rxjs";
import {Http} from "@angular/http";

declare const d3, tippy;

@Component({
  selector: 'day-breakdown-chart',
  templateUrl: 'day-breakdown-chart/day-breakdown-chart.html',
  styleUrls: ['day-breakdown-chart/day-breakdown-chart.css']
})

export class DayBreakdownChartComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  date: Date;
  dateData: Object;

  dateDataUpdated: EventEmitter<any> = new EventEmitter();


  constructor(
    private http: Http,
    private commonService: CommonService
  ){}

  ngOnInit() {

    // Subscribe to listen for new date change
    this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
      this.date = res; // Set date in class
      this.fetchDateTeamData(this.date); // Initiate the fetching of new date data
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
    console.log(rawDateData);
  }
}
