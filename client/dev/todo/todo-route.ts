import {
	Routes,
	RouterModule
} from "@angular/router";

import {
	TodoCmp
} from "./todo-cmp";

const todoRoutes:Routes = [
	{
		path: "todo",
		component: TodoCmp,
		pathMatch: "full"
	}
];

export const todoRouting = RouterModule.forRoot(todoRoutes);
