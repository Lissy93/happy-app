import {Component, Input} from "@angular/core";
import {MatProgressSpinnerModule} from '@angular/material';


@Component({
  selector: "loader",
  templateUrl: "./components/loader/loader.html"
})

export class LoaderComponent {
  @Input() color = 'accent';
  @Input() mode = 'indeterminate';
  @Input() value = 0;
}

