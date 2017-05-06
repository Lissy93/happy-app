import { Component } from "@angular/core";

@Component({
  selector: "navbar",
  templateUrl: "navbar/navbar.html",
  styleUrls: ["navbar/navbar.css"]
})

export class NavbarComponent {

  teams: string[] = ['team-1','team-2','team-3'];


}
