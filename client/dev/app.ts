import { Angulartics2GoogleTagManager } from 'angulartics2';
import { Component } from "@angular/core";

@Component({
	selector: "app",
	template: `
		<router-outlet></router-outlet>
	`
})
export class App {
  constructor(angulartics2GoogleTagManager: Angulartics2GoogleTagManager) {}
}
