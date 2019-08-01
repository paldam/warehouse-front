import {Injectable} from "@angular/core";
import {HttpService} from "../../http-service";
import {Order} from "../../model/order.model";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {DeliveryType} from "../../model/delivery_type.model";
import {Notification} from "../../model/notification";




@Injectable()
export class NotificationsService {
	 private  protocol: string = "http";
	private port: number = 8080;
	private baseUrl: string;

	public showNotificationModal: boolean = false;
	public notifications: Notification[] = [];
	public notificationsTotal: number = 0;



	public constructor(private http: HttpService) {
		this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
		this.setEventSource();
		this.checkNumberOfNotifications();

		this.getNotifications().subscribe(data => {
			this.notifications = data;
		});

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

	setEventSource() {
		let source = new EventSource('http://localhost:8080/notification',);
		source.addEventListener('message', message => {
			console.log(message);
			this.checkNumberOfNotifications();
			this.getNotifications().subscribe(data => {
				this.notifications = data;
			});

		});
	}

	checkNumberOfNotifications() {
		this.getNotificationsCount().subscribe(value => {
			this.notificationsTotal = value;
		});
	}


	showNotificationModalF() {
		this.showNotificationModal = true;
		this.getNotifications().subscribe(data => {
			this.notifications = data;
		});
	}





}