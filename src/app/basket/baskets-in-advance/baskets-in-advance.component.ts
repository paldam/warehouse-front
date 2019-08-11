import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BasketService} from "../basket.service";
import {SpinerService} from "../../spiner.service";
import {CustomerService} from "../../customer/customer.service";
import {OrderService} from "../../order/order.service";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {ConfirmationService} from "primeng/api";
import {AuthenticationService} from "../../authentication.service";
import {Basket} from "../../model/basket.model";
import {OrderItem} from "../../model/order_item";
import {BasketType} from "../../model/basket_type.model";

@Component({
	selector: 'app-baskets-in-advance',
	templateUrl: './baskets-in-advance.component.html',
	styleUrls: ['./baskets-in-advance.component.css']
})
export class BasketsInAdvanceComponent implements OnInit {
	public baskets: Basket[] = [];
	public orderItems: OrderItem[] = [];

	constructor(private router: Router, private basketService: BasketService, private spinerService: SpinerService,
				private messageServiceExt: MessageServiceExt, private confirmationService: ConfirmationService, private authenticationService: AuthenticationService) {
		basketService.getBaskets().subscribe(data => this.baskets = data);
	}

	ngOnInit() {
	}

	updateQuantity(basketLine: OrderItem, quantity: number) {
		if (quantity == 0) {
			this.deleteProductLine(basketLine.basket.basketId);
		}
		let line = this.orderItems.find(line => line.basket.basketId == basketLine.basket.basketId);
		if (line != undefined) {
			line.quantity = Number(quantity);
		}
		// this.recalculateTotalPlusMarkUp();
	}

	deleteProductLine(id: number) {
		let index = this.orderItems.findIndex(data => data.basket.basketId == id);
		if (index > -1) {
			this.orderItems.splice(index, 1);
		}
	}

	addBasketToOrder(basket: Basket) {
		let line = this.orderItems.find(data => data.basket.basketId == basket.basketId);
		if (line == undefined) {
			this.orderItems.push(new OrderItem(basket, 1))
		} else {
			line.quantity = line.quantity + 1;
		}
		// this.recalculateTotalPlusMarkUp();
	}

	isBasketLinesEmpty(): boolean {
		if (this.orderItems.length == 0) {
			return true
		} else {
			return false
		}
	}

	refreshData() {
		this.basketService.getBaskets().subscribe(data => {
			this.baskets = data
		}, error => {
			this.spinerService.showSpinner = false;
		}, () => {
			this.spinerService.showSpinner = false;
		});
	}

	addBaskettoStock() {
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz dodać kosze na stan ? ',
			accept: () => {
				this.spinerService.showSpinner = true;
				this.basketService.addBasketsToStock(this.orderItems).subscribe(value => {
				}, error => {
					this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);
					this.spinerService.showSpinner = false;
				}, () => {
					this.messageServiceExt.addMessage('success', 'Uwaga', 'Dodano kosze na stan');
					this.refreshData();
					this.orderItems = [];
				});
			},
			reject: () => {
			}
		});
	}

	editBasketStock(basket: Basket) {
		this.spinerService.showSpinner = true;
		this.basketService.saveNewStockOfBasket(basket.basketId, basket.stock).subscribe(
			value => {
				this.refreshData();
				this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji stanu magazynowego koszy', 5000);
			},
			error => {
				this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ', 5000);
			}
		)
	}
}
