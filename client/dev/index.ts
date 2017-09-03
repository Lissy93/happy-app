import {
  platformBrowserDynamic
} from "@angular/platform-browser-dynamic";

import {enableProdMode} from '@angular/core';

import {
  AppModule
} from "./app.module";

// enableProdMode(); // UNCOMMENT THIS TO ENABLE PRODUCTION MODE
// TODO find better way of just commenting/ uncommenting that ^^

platformBrowserDynamic().bootstrapModule(AppModule);
