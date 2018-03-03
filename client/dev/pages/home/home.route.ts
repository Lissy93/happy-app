import {
	Routes,
	RouterModule
} from "@angular/router";

import { HomeComponent } from "./home.component";
import {TeamComponent} from "../team/team.component";
import {SubmitResponseComponent} from "../submit-response/submit-response.component";

const homeRoutes:Routes = [
	{
		path: "",
		component: HomeComponent,
		pathMatch: "full"
	},
  {
		path: "team/:teamName",
		component: TeamComponent,
	},
  {
		path: "submit-response",
		component: SubmitResponseComponent,
	},
];

export const homeRouting = RouterModule.forRoot(homeRoutes);
