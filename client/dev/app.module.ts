import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule, FormBuilder } from "@angular/forms";
import { BrowserModule  } from "@angular/platform-browser";
import { App }   from "./app";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent }   from "./home/home.component";
import { homeRouting } from "./home/home.route";
import { HomeService }   from "./home/home.service";

import { NavbarComponent } from './navbar/navbar.component';
import {MaterialModule} from "@angular/material";

@NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      homeRouting,
      BrowserAnimationsModule,
      MaterialModule
    ],
    declarations: [
      App,
      HomeComponent,
      NavbarComponent
    ],
    providers: [
      HomeService
    ],
    bootstrap: [
      App
    ],
})
export class AppModule {}
