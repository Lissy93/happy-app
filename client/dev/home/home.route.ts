import {
	Routes,
	RouterModule
} from "@angular/router";

import { HomeComponent } from "./home.component";
import {TeamComponent} from "../team/team.component";

const homeRoutes:Routes = [
	{
		path: "",
		component: HomeComponent,
		pathMatch: "full"
	},
  {
		path: ":teamName",
		component: TeamComponent,
	},
];

export const homeRouting = RouterModule.forRoot(homeRoutes);
