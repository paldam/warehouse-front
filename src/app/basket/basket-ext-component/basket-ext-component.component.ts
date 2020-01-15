import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BasketExtService} from "../basket-ext.service";
import {Router} from "@angular/router";
import {Basket} from "../../model/basket.model";
import {ConfirmationService, SelectItem} from "primeng/primeng";
import {BasketType} from "../../model/basket_type.model";
import {AuthenticationService} from "../../authentication.service";
import {MenuItem} from 'primeng/api';
import {BasketExt} from '../../model/BasketExt';
import {AppConstans} from "../../constans";
import {MessageServiceExt} from "../../messages/messageServiceExt";

@Component({
	selector: 'app-basket-ext-component',
	templateUrl: 'basket-ext-component.component.html',
	styleUrls: ['basket-ext-component.component.css']
})
export class BasketExtComponentComponent
	implements OnInit {
	public baskets: Basket[] = [];
	public loading: boolean;
	public gb: any;
	public url: string = '';
	public items: MenuItem[];
	public alcoholOptions: SelectItem[];
	public selectedBasketOnContextMenu: BasketExt = new BasketExt();
	@ViewChild('onlyDeleted') el: ElementRef;
	public paginatorValues = AppConstans.PAGINATOR_VALUES;

	constructor(private basketService: BasketExtService, private router: Router,
				private messageServiceExt: MessageServiceExt, private confirmationService: ConfirmationService,
				private authenticationService: AuthenticationService) {
		basketService.getBaskets().subscribe(data => this.baskets = data,
			error => {
			}, () => {
				this.baskets.forEach(value => {
					value.basketTotalPrice /= 100;
				})
			});
		this.url = router.url;
	}

	ngOnInit() {
		this.items = [
			{
				label: 'Zmień dostępność',
				icon: 'fa fa-plus',
				command: (event) => this.changeStatus(this.selectedBasketOnContextMenu)
			}
		];
		this.alcoholOptions = [
			{label: 'Z alkocholem', value: '1'},
			{label: 'Bez alkocholu', value: '0'},
		];
	}

	changeStatus(basket: BasketExt) {
		let tmpStatus;
		if (basket.isAvailable == 1) {
			tmpStatus = 0;
		} else {
			tmpStatus = 1;
		}
		basket.isAvailable = tmpStatus;
		basket.basketTotalPrice *= 100;
		this.basketService.changeStatus(basket).subscribe();
		this.refreshData();
	}

	contextMenuSelected(event) {
		this.selectedBasketOnContextMenu = event.data;
	}

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.basketService.getBaskets().subscribe(data => this.baskets = data,
				error1 => {
				}, () => {
					this.baskets.forEach(value => {
						value.basketTotalPrice /= 100;
					})
				});
			this.loading = false;
		}, 1000);
	}

	updateBasketExtRow(event: any) {
		let basket;
		if (event.data) {
			basket = event.data;
		} else {
			basket = event
		}
		let convertedPrice: string = basket.basketTotalPrice;
		basket.basketTotalPrice = convertedPrice.toString().replace(/,/g, '.');
		basket.basketTotalPrice = basket.basketTotalPrice * 100;
		this.basketService.editBasket(basket).subscribe(data => {
			this.messageServiceExt.addMessageWithTime(
				'success', 'Status', 'Dokonano edycji stanu produktu', 1000);
			this.refreshData();
		}, error => {
			this.messageServiceExt.addMessage(
				'error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);
			event.data.basketTotalPrice = event.data.basketTotalPrice / 100;
		}, () => {
			event.data.basketTotalPrice = event.data.basketTotalPrice / 100;
		});
	}

	ShowConfirmModal(basket: Basket) {
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz przenieś kosz  ' + basket.basketName + ' do archiwum ?',
			accept: () => {
				basket.basketTotalPrice = basket.basketTotalPrice * 100;
				basket.basketType = new BasketType(99);
				this.basketService.editBasket(basket).subscribe(data => {
					this.refreshData();
				});
			},
			reject: () => {
			}
		});
	}
}
