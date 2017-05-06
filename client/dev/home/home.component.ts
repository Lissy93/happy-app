import {
  Component,
  OnInit
} from "@angular/core";

import { HomeService } from "./home.service";

type Home = {
  projectName: string;
  teamName: string,
  _id?: string;
};

@Component({
  selector: "home-page",
  templateUrl: "home/home.html",
  styleUrls: ["home/home.css"]
})
export class HomeComponent implements OnInit {
  title: string = "happy-app";

  constructor(private _homeService: HomeService) { }

  ngOnInit() { }

}
