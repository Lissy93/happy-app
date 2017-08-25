import {Component, Input} from "@angular/core";
import {Http} from "@angular/http";
import {Router, ActivatedRoute} from "@angular/router";
import {TeamService} from "../../team.service";
import {AllTeamsService} from "../../all-teams.service";
import {MdDialog, MdSnackBar} from "@angular/material";
import {AppFeedbackComponent} from "../../components/app-feedback/app-feedback";
import {AppHelpComponent} from "../../components/app-help/app-help";

@Component({
  selector: "navbar",
  templateUrl: "components/navbar/navbar.html",
  styleUrls: ["components/navbar/navbar.css"],
  providers: [AppFeedbackComponent]
})

export class NavbarComponent {

  @Input() teams: string[];
  router: Router;
  teamName = '';

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private dialog: MdDialog,
    router: Router,
    private teamService: TeamService,
    private allTeamsService: AllTeamsService,
    public snackBar: MdSnackBar
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

  openFeedbackDialog(){
    this.dialog.open(AppFeedbackComponent);
  }

  openHelpDialog(){
    this.dialog.open(AppHelpComponent);
  }

  navigateToTeam(teamName) {
    this.router.navigate([`./${teamName}`]);
    this.teamName = teamName;
  }

  navigateToHome(){
    this.router.navigate(['./']);
    this.teamName = '';
  }

  showFeatureUnavailableToast() {
    this.snackBar.open('Feature still under development, or not available on demo', 'Got it');
  }

}


