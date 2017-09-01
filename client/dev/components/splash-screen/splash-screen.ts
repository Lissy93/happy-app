import {Component, Input, OnInit} from "@angular/core";
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: "splash-screen",
  templateUrl: "components/splash-screen/splash-screen.html",
  styleUrls: ["components/splash-screen/splash-screen.css"],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate(500, style({opacity:1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(1500, style({opacity:0}))
      ])
    ])
  ]
})

export class SplashScreenComponent implements OnInit{

  @Input() shouldDisplaySplash: boolean;
  statusMessage: string = '';
  spinnerMode = 'determinate';
  spinnerProgress = 0;
  showErrorMessage = false;

  states = [
    {progress: 15, message: 'Loading Files'},
    {progress: 30, message: 'Fetching Latest Data'},
    {progress: 45, message: 'Calculating Results'},
    {progress: 60, message: 'Rendering Chart'},
    {progress: 75, message: 'Finishing Up'},
    {progress: 80, message: 'Finishing Up.'},
    {progress: 85, message: 'Finishing Up..'},
    {progress: 90, message: 'Finishing Up...'},
    {progress: 95, message: 'Checking for errors'}
  ];

  ngOnInit(){
    this.fancySpinnerTricks(); // Show loading spinner at correct state
  }

  /**
   * Lets make that loading spinner look like it's actually doing something smart!
   */
  fancySpinnerTricks(){
    let i = 0;
    setInterval(() => {
      if(i < this.states.length){
        this.statusMessage = this.states[i].message;
        this.spinnerProgress = this.states[i].progress;
      }
      else{
        this.statusMessage = "Loading the app is taking longer than usual...";
        this.spinnerMode = 'indeterminate';
        this.showErrorMessage = true;
      }
      i++;
    }, 300);
  }

  hideSplash(){
    this.shouldDisplaySplash = false;
  }

  showSplash(){
    this.shouldDisplaySplash = true;
  }


}


