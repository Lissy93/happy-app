import {Component, Input} from "@angular/core";

@Component({
  selector: "navbar",
  templateUrl: "navbar/navbar.html",
  styleUrls: ["navbar/navbar.css"]
})

export class NavbarComponent {
  @Input() teams: string[];
}
