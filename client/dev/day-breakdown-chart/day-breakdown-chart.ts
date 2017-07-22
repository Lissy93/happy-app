import {Component, OnInit, OnDestroy} from '@angular/core';
import { SharedModule } from '../shared-helpers.module';
import { AllTeamsService } from '../all-teams.service';
import {CommonService} from "../sommon.service";
import {Subscription} from "rxjs";

declare const d3, tippy;

@Component({
  selector: 'day-breakdown-chart',
  templateUrl: 'day-breakdown-chart/day-breakdown-chart.html',
  styleUrls: ['day-breakdown-chart/day-breakdown-chart.css']
})

export class DayBreakdownChartComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  date: Date;

  constructor( private commonService: CommonService ){}

  ngOnInit() {
    this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
      this.date = res;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
