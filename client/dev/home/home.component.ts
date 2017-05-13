import {Component, OnInit} from "@angular/core";

import {HomeService } from './home.service';

import {Http} from "@angular/http";

import {ActivatedRoute} from '@angular/router';


@Component({
  selector: "home-page",
  templateUrl: "home/home.html",
  styleUrls: ["home/home.css"]
})
export class HomeComponent implements OnInit{


  title: string = "happy-app";
  teams: any = [];
  teamName: string;

  constructor(private homeService: HomeService, private route:ActivatedRoute) {



  }


  ngOnInit() {
    this.homeService.getAllTeams().subscribe(teams => {
      this.teams = teams;
    });

    this.route.params.subscribe( params =>
      this.teamName = params['teamName']
    )
  }


}
