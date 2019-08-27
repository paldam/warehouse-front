import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {NavigationEnd, Router} from "@angular/router";
import {TOKEN} from "./authentication.service";
import {filter} from "rxjs/operators";

@Injectable({
	providedIn: 'root',
})
export class ServerSideEventsService {


	public  newOrderEventSource: EventSource ;


	constructor() {

	}


	public renew() {
		this.newOrderEventSource = new EventSource('http://localhost:8080/new_order_notification');
	}




}