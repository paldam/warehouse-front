import {Component, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {AuthenticationService} from "../../authentication.service";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {User} from "../../model/user.model";
import {AppConstants} from "../../constans";
import {PrizeOrder} from "../../model/prize-order.model";
import {PrizeService} from "../prize.service";
import {Order} from "../../model/order.model";
import {MenuItem} from "primeng/api";

@Component({
	selector: 'app-prize-order',
	templateUrl: './prize-order.component.html',
	styleUrls: ['./prize-order.component.css']
})
export class PrizeOrderComponent implements OnInit {
	public loading: boolean;
	public orders: PrizeOrder [] = [];
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	public showOrderPreviewModal: boolean = false;
	public isOrderToShowFetchComplete: Promise<boolean>;
	public selectedOrderFromRow: PrizeOrder = new PrizeOrder();
	public selectedToPrintOrder: PrizeOrder = new PrizeOrder();
	public menuItems: MenuItem[];
	public selectedToMenuOrder: number;

	constructor(private prizeService: PrizeService, private userService: UserService, private authenticationService: AuthenticationService, public  messageServiceExt: MessageServiceExt) {
		prizeService.getPrizeOrders().subscribe((data: any) => {
			this.orders = data;
		})
	}

	ngOnInit() {

		this.setContextMenu();
	}

	showOrderPreview(event) {
		console.log("rsaas");
		let orderIdTmp;
		orderIdTmp = (event instanceof MouseEvent) ? this.selectedOrderFromRow.id : event.data.id;
		this.prizeService.getPrizeOrder(orderIdTmp).subscribe((data :any) => {
				this.selectedToPrintOrder = data;
			}
			, null
			, () => {
				this.isOrderToShowFetchComplete = Promise.resolve(true);
			});
		this.showOrderPreviewModal = true;
	}

	OnSelectRow(event) {
		this.selectedToMenuOrder = event.data.id;
	}

	private setContextMenu(){
		this.menuItems = [

			{
				label: 'Zmień status ', icon: 'fa fa-share',
				items: [
					{label: 'Nowe', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(1)},
					{label: 'Zrealizowane', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(3)},
					{label: 'Anulowane', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(2)},
				]
			},

		];

	}


	changeOrderStatus(orderStatus: number) {

			this.prizeService.changeOrderStatus(this.selectedToMenuOrder, orderStatus).subscribe(data => {
				this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono status zamówienia');
			}, error => {
				this.messageServiceExt.addMessage('error', 'Błąd ', error._body);
			}, () => {
				this.refreshData();
			});

	}




	getOrderFromRow(event) {
		this.selectedOrderFromRow = event.data;
	}

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.prizeService.getPrizeOrders().subscribe((data: any) => {
				this.orders = data;
			});
			this.loading = false;
		}, 1000);
	}
}
