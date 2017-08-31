import {Component, OnInit, OnDestroy} from "@angular/core";

import {ActivatedRoute} from '@angular/router';
import {TeamService} from "../../services/team.service";

@Component({
  selector: "team-page",
  templateUrl: "pages/team/team.html",
  styleUrls: ["pages/team/team.css"]
})
export class TeamComponent implements OnInit, OnDestroy {

  title: string = "happy-app";

  constructor(
    private teamService: TeamService,
    private route:ActivatedRoute,
  ) {}


  ngOnInit() {}

  ngOnDestroy(){
    console.log("D E S T R O Y E D ! ! ! !");
  }

}
