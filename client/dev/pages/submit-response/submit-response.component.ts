import {Component } from "@angular/core";

@Component({
  selector: "submit-response-page",
  templateUrl: "./pages/submit-response/submit-response.html",
  styleUrls: ["./pages/submit-response/submit-response.css"]
})
export class SubmitResponseComponent {

  title: string = "happy-app";

  constructor() {
    console.log("submit response");
  }

}
