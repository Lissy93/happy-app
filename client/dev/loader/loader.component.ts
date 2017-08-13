import {Component} from "@angular/core";
import {MdProgressSpinnerModule} from '@angular/material';


@Component({
  selector: "loader",
  templateUrl: "loader/loader.html"
})

export class LoaderComponent {
  color = 'accent';
  mode = 'indeterminate';
  value = 50;
}

