import {Injectable} from "@angular/core";
import {HttpService} from "./http-service";

@Injectable({
	providedIn: 'root',
})
export class ServerSideEventsService {
	public newOrderEventSource: EventSource;
	public orderCopyEventSource: EventSource;
	public protocol: string = "http";
	public port: number = 8080;
	public baseUrl: string;

	public constructor(private http: HttpService) {
		this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
	}

	public renew() {
		this.newOrderEventSource = new EventSource(this.baseUrl + '/new_order_notification');
	}

	public renewOrderCopy() {
		this.orderCopyEventSource = new EventSource(this.baseUrl + '/notification');
	}
}