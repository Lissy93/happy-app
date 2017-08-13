import { Component  } from "@angular/core";
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: "splash-screen",
  templateUrl: "splash-screen/splash-screen.html",
  styleUrls: ["splash-screen/splash-screen.css"],
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

export class SplashScreenComponent {

  states = [
    {time: 0, progress: 0, message: ''},
    {time: 0, progress: 0, message: ''},
    {time: 0, progress: 0, message: ''},
    {time: 0, progress: 0, message: ''}
  ]

}


