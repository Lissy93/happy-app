import {Component, OnInit} from "@angular/core";

import {ActivatedRoute} from '@angular/router';
import {TeamService} from "../../services/team.service";

@Component({
  selector: "team-page",
  templateUrl: "pages/team/team.html",
  styleUrls: ["pages/team/team.css"]
})
export class TeamComponent implements OnInit{

  title: string = "happy-app";

  constructor(
    private teamService: TeamService,
    private route:ActivatedRoute,
  ) {}


  ngOnInit() {}

}
