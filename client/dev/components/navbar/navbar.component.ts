import {Component, Input} from "@angular/core";
import {Http} from "@angular/http";
import {Router, ActivatedRoute} from "@angular/router";
import {TeamService} from "../../services/team.service";
import {AllTeamsService} from "../../services/all-teams.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

import {AppFeedbackComponent} from "../app-feedback/app-feedback";
import {AppHelpComponent} from "../app-help/app-help";
import { Angulartics2 } from 'angulartics2';
import {SubmitResponseComponent} from "../../pages/submit-response/submit-response.component";

@Component({
  selector: "navbar",
  templateUrl: "./components/navbar/navbar.html",
  styleUrls: ["./components/navbar/navbar.css"],
  providers: [AppFeedbackComponent]
})

export class NavbarComponent {

  @Input() teams: string[];
  router: Router;
  teamName = '';

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private teamService: TeamService,
    private allTeamsService: AllTeamsService,
    public snackBar: MatSnackBar,
    private angulartics2: Angulartics2,
    router: Router
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

  trackNavigationAnalyticEvents(action, properties = {}){
    this.angulartics2.eventTrack.next({ action: action, properties: properties});
  }

  openSubmitResponseDialog(){
    this.dialog.open(SubmitResponseComponent);
    this.trackNavigationAnalyticEvents('SubmitResponseDialogOpened');
  }

  openFeedbackDialog(){
    this.dialog.open(AppFeedbackComponent);
    this.trackNavigationAnalyticEvents('FeedbackDialogOpened');
  }

  openHelpDialog(){
    this.dialog.open(AppHelpComponent);
    this.trackNavigationAnalyticEvents('HelpDialogOpened');
  }

  navigateToTeam(teamName) {
    this.router.navigate([`./team/${teamName}`]);
    this.teamName = teamName;
    this.trackNavigationAnalyticEvents('NavigatedToTeam', {teamName: teamName});
  }

  navigateToHome(){
    this.router.navigate(['./']);
    this.teamName = '';
    this.trackNavigationAnalyticEvents('NavigatedBackToHome');
  }

  showFeatureUnavailableToast() {
    let config = new MatSnackBarConfig();
    config.duration = 1500;
    config.extraClasses = ['feature-still-under-dev-toast'];
    this.snackBar.open('Feature still under development, or not available on demo', 'Got it', config);
    this.trackNavigationAnalyticEvents('TriedToAccessAlphaComponent');
  }

}




