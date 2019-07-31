import {Injectable} from "@angular/core";
import {HttpService} from "../../http-service";
import {Order} from "../../model/order.model";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {DeliveryType} from "../../model/delivery_type.model";
import {Notification} from "../../model/notification";

@Injectable()
export class NotificationsService {
	public protocol: string = "http";
	public port: number = 8080;
	public baseUrl: string;

	public constructor(private http: HttpService) {
		this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
	}

	getNotifications(): Observable<Notification[]> {
		return this.http.get(this.baseUrl + `/notificationslist`)
			.map((response: Response) =>
				response.json());
	}

	getNotificationsCount(): Observable<number> {
		return this.http.get(this.baseUrl + `/notifications/count`)
			.map((response: Response) =>
				response.json());
	}


}