import {Component, OnInit} from "@angular/core";

import {HomeService } from './home.service';

import {ActivatedRoute} from '@angular/router';
import {TeamService} from "../team.service";

@Component({
  selector: "home-page",
  templateUrl: "home/home.html",
  styleUrls: ["home/home.css"]
})
export class HomeComponent implements OnInit{

  title: string = "happy-app";

  constructor(
    private homeService: HomeService,
    private route:ActivatedRoute,
    private teamService: TeamService
  ) {}


  ngOnInit() {}

}
