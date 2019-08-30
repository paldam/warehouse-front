import {Component, OnInit, ViewChild} from '@angular/core';
import {LeftNavComponent} from '../left-nav/left-nav.component';
import {User} from "../../model/user.model";
import {NgForm} from "@angular/forms";
import {PasswordChange} from "../../model/password_change.model";
import {AuthenticationService, TOKEN, TOKEN_USER} from "../../authentication.service";
import {UserService} from "../../user.service";
import {NotificationsService} from "./notification.service";
import {Notification} from "../../model/notification";
import {OrderComponent} from "../../order/order-view/order.component";
import {BasketService} from "../../basket/basket.service";
import {OrderService} from "../../order/order.service";

declare var jquery: any;
declare var $: any;

@Component({
	selector: 'top-nav',
	providers:[OrderComponent,BasketService,OrderService],
	templateUrl: './top-nav.component.html',
	styleUrls: ['./top-nav.component.css']
})
export class NavComponent implements OnInit {


	constructor(public notificationsService: NotificationsService , public authenticationService :AuthenticationService, private orderComponent  :OrderComponent) {



	}

	@ViewChild(LeftNavComponent) leftNavComponent: LeftNavComponent;

	ngOnInit() {
	}





	slideChildLeftNavbar() {
		this.leftNavComponent.slidNav();
	}



	lookupRowStyleClass(rowData: Notification): string {

		return rowData.wasRead ? '' : 'notification-bold';



	}

	getBadgeStyle(): string {
		if (this.notificationsService.notificationsTotal == 0) {
			return "badge"
		} else if (this.notificationsService.notificationsTotal <= 9) {
			return "badge1";
		} else if (this.notificationsService.notificationsTotal > 9)
			return "badge2";
	}
}

