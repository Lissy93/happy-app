import {
	Routes,
	RouterModule
} from "@angular/router";

import { HomeComponent } from "./home.component";

const homeRoutes:Routes = [
	{
		path: "",
		component: HomeComponent,
		pathMatch: "full"
	},
  {
		path: ":teamName",
		component: HomeComponent,
	},
];

export const homeRouting = RouterModule.forRoot(homeRoutes);
