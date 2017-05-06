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
	}
];

export const homeRouting = RouterModule.forRoot(homeRoutes);
