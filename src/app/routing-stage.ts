import {filter} from "rxjs/operators";
import {NavigationEnd, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {ServerSideEventsService} from "./server-side-events-service";

@Injectable()
export class RoutingState {
	private history = [];
	private lastEvent :any;
	private _lastScrollYPosition: number = 0;


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

	public getlastScrollYPosition(): number {
		return this._lastScrollYPosition;
	}

	public setlastScrollYPosition(value: number) {
		this._lastScrollYPosition = value;
	}

	public getHistory(): string[] {
		return this.history;
	}

	public getLastEvent(): any {
		return this.lastEvent;
	}

	public setLastEvent(event : any){
		this.lastEvent = event;
	}

	public getPreviousUrl(): string {
		return this.history[this.history.length - 2] || '/index';
	}

	public getCurrentPage(): string {
		return this.router.url
	}
}


