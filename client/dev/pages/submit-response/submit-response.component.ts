import {Component } from "@angular/core";
import {FormControl, Validators} from "@angular/forms";

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

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

}
