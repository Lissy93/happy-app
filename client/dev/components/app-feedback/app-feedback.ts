
import {Component} from "@angular/core";

@Component({
  selector: 'app-feedback',
  templateUrl: './components/app-feedback/app-feedback.html',
  styleUrls: ['./components/app-feedback/app-feedback.css']
})
export class AppFeedbackComponent {
  constructor() {
    console.log('constructor called');
  }
}
