import {Component, OnInit, ViewChild} from '@angular/core';
import {LeftNavComponent} from '../left-nav/left-nav.component';
import {User} from "../../model/user.model";
import {NgForm} from "@angular/forms";
import {PasswordChange} from "../../model/password_change.model";
import {AuthenticationService, TOKEN, TOKEN_USER} from "../../authentication.service";
import {UserService} from "../../user.service";
import {NotificationsService} from "./notification.service";
import {Notification} from "../../model/notification";

declare var jquery: any;
declare var $: any;

@Component({
	selector: 'top-nav',
	templateUrl: './top-nav.component.html',
	styleUrls: ['./top-nav.component.css']
})
export class NavComponent implements OnInit {
	public showNotificationModal: boolean = false;
	public notifications: Notification[] = [];
	public notificationsTotal: number = 0;

	constructor(private notificationsService: NotificationsService , private authenticationService :AuthenticationService) {

		this.setEventSource();

		notificationsService.getNotifications().subscribe(data => {
			this.notifications = data;
		});

		this.checkNumberOfNotifications();
	}

	@ViewChild(LeftNavComponent) leftNavComponent: LeftNavComponent;

	ngOnInit() {
	}

	showNotificationModalF() {
		this.showNotificationModal = true;
		this.notificationsService.getNotifications().subscribe(data => {
			this.notifications = data;
		});
	}

	slideChildLeftNavbar() {
		this.leftNavComponent.slidNav();
	}

	checkNumberOfNotifications() {
		this.notificationsService.getNotificationsCount().subscribe(value => {
			this.notificationsTotal = value;
		});
	}

	setEventSource() {
		let source = new EventSource('http://localhost:8080/notification',);
		source.addEventListener('message', message => {
			console.log("adad");
			console.log(message);
			this.checkNumberOfNotifications();
		});
	}

	getBadgeStyle(): string {
		if (this.notificationsTotal == 0) {
			return "badge"
		} else if (this.notificationsTotal <= 9) {
			return "badge1";
		} else if (this.notificationsTotal > 9)
			return "badge2";
	}
}

