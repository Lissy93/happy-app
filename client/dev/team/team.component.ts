import {Component, OnInit} from "@angular/core";

import {ActivatedRoute} from '@angular/router';
import {TeamService} from "../team.service";

@Component({
  selector: "team-page",
  templateUrl: "team/team.html",
  styleUrls: ["team/team.css"]
})
export class TeamComponent implements OnInit{

  title: string = "happy-app";

  constructor(
    private teamService: TeamService,
    private route:ActivatedRoute,
  ) {}


  ngOnInit() {}

}
