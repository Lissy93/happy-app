
import {Injectable, EventEmitter, Output, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import {Http} from "@angular/http";

@Injectable()
export class AllTeamsService {


    teams: string[] = []; // An array of team names
    teamsSentimentSummary: any = []; // An array of latest team results

    @Output()
    teamListUpdated: EventEmitter<any> = new EventEmitter();
    teamDataUpdated: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: Http
    ) { }


    /**
     * Returns currently stored array of teams
     */
    getTeams(){
        if(this.teams.length < 1) this.fetchTeams(); // fetch if not yet fetched
        return this.teams;
    }

    /**
     * Returns currently stored team data
     */
    getTeamSummary(){
      if(this.teamsSentimentSummary.length < 1) this.fetchTeamSummary();
      return this.teamsSentimentSummary;
    }

    /**
     * Triggers re-fetch of all team data
     */
    refreshTeamData(){
      this.fetchTeams(); // Update the teams list
      this.fetchTeamSummary(); // Update the seam sentiment data
    }

    /**
     * Fetch all teams, stores to class
     */
    private fetchTeams(){
        this.http.get('/api/teams')
            .map(res => res.json())
            .subscribe(teams =>{
                this.teams = teams;
                this.teamListUpdated.emit(this.teams);
            }
        );
    }

    /**
     * Fetch all team sentiment data, stores to class
     */
    private fetchTeamSummary(){
      this.http.get('/api/team-sentiment')
        .map(res => res.json())
        .subscribe(teamsSentimentSumamry => {
            this.teamsSentimentSummary = teamsSentimentSumamry;
            this.teamDataUpdated.emit(this.teamsSentimentSummary);
          }
        );
    }

}
