
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


  setTeam(currentTeam){
    this.currentTeam  = currentTeam;
    this.fetchTeamSentimentData();
  }

  getTeam(){
    return this.currentTeam;
  }


  fetchTeamSentimentData(){
    this.http.get('/api/team-sentiment/'+this.currentTeam)
      .map(res => res.json())
      .subscribe(teamSentimentData => {
          this.teamSentimentData = teamSentimentData;
          this.sentimentDataUpdated.emit(this.teamSentimentData);
        }
      );
  }

  getTeamSentimentData(){
    return this.teamSentimentData;
  }



}
