import {filter} from "rxjs/operators";
import {NavigationEnd, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {ServerSideEventsService} from "./server-side-events-service";

@Injectable()
export class RoutingState {
	private history = [];

	constructor(
		private router: Router, private serverSideEventsService: ServerSideEventsService
	) {
	}

	public loadRouting(): void {
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(({urlAfterRedirects}: NavigationEnd) => {
				this.history = [...this.history, urlAfterRedirects];
			});
	}

	public getHistory(): string[] {
		return this.history;
	}

	public getPreviousUrl(): string {
		return this.history[this.history.length - 1] || '/index';
	}

	public getCurrentPage(): string {
		return this.router.url
	}
}


