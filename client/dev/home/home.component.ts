import {Component, OnInit} from "@angular/core";

import {HomeService } from './home.service';

import {ActivatedRoute} from '@angular/router';

@Component({
  selector: "home-page",
  templateUrl: "home/home.html",
  styleUrls: ["home/home.css"]
})
export class HomeComponent implements OnInit{


  title: string = "happy-app";
  teamName: string;

  constructor(
    private homeService: HomeService,
    private route:ActivatedRoute
  ) { }


  ngOnInit() {

    // // Fetch list of teams
    // this.homeService.getAllTeams().subscribe(teams =>
    //   this.teams = teams
    // );

    // // Get requested team name
    // this.route.params.subscribe( params =>
    //   this.teamName = params['teamName']
    // );

}


}
