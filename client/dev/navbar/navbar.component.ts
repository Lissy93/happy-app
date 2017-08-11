import {Component, Input} from "@angular/core";
import {Http} from "@angular/http";
import {Router, ActivatedRoute} from "@angular/router";
import {TeamService} from "../team.service";
import {AllTeamsService} from "../all-teams.service";

@Component({
  selector: "navbar",
  templateUrl: "navbar/navbar.html",
  styleUrls: ["navbar/navbar.css"]
})

export class NavbarComponent {

  @Input() teams: string[];
  router: Router;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    router: Router,
    private teamService: TeamService,
    private allTeamsService: AllTeamsService
  ) {
    this.router = router;
  }

  ngOnInit(){

    // Get the teams, and keep them updated
    this.teams = this.allTeamsService.getTeams();
    this.allTeamsService.teamListUpdated.subscribe(
      (teams) => { this.teams  = teams; }
    );

    // Get requested team name
    this.route.params.subscribe( params =>
      this.teamService.setTeam(params['teamName'])
    );

  }

  navigateToTeam(teamName) {
    this.router.navigate([`./${teamName}`]);
  }

  navigateToHome(){
    this.router.navigate(['./']);
  }


}

