
import {Injectable, EventEmitter, Output, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import {Http} from "@angular/http";

@Injectable()
export class AllTeamsService {


    teams: string[] = []; // An array of team names
    teamsSentimentSumamry: Object = []; // An array of latest team results

    @Output()
    teamListUpdated: EventEmitter<any> = new EventEmitter();


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
    getTeamSummary(){}

    /**
     * Triggers re-fetch of all team data
     */
    refreshTeamData(){}

    /**
     * Fetch all teams, stores to class
     */
    private fetchTeams(){
      console.log('just going to fetch....');
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
    private fetchTeamSummary(){}

}
