
import {Injectable, EventEmitter, Output} from '@angular/core';
import 'rxjs/add/operator/map';
import {Http} from "@angular/http";

@Injectable()
export class TeamService {


  currentTeam: string; // The team name
  teamSentimentData: Object; // The corresponding data

  @Output()
  sentimentDataUpdated: EventEmitter<any> = new EventEmitter();


  constructor(
    private http: Http
  ) { }


  /**
   * Set the currently selected team locally
   * @param currentTeam
   */
  setTeam(currentTeam){
    this.currentTeam  = currentTeam;
    this.fetchTeamSentimentData();
  }

  /**
   * Get the currently selected local team
   * @returns {string}
   */
  getTeam(){
    return this.currentTeam;
  }

  /**
   * Returns team sentiment data
   * (which will have already been fetched, when team was set)
   * @returns {Object}
   */
  getTeamSentimentData(){
    return this.teamSentimentData;
  }

  /**
   * Request to the API
   * Called whenever team changes
   * Fetches sentiment data for any given team
   */
  fetchTeamSentimentData(){
    this.http.get('/api/team-sentiment/'+this.currentTeam)
      .map(res => res.json())
      .subscribe(teamSentimentData => {
          this.teamSentimentData = teamSentimentData;
          this.sentimentDataUpdated.emit(this.teamSentimentData);
        }
      );
  }





}
