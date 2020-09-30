import {OrderViewPageType} from "./order-view-page-type";
import {OrderService} from "./order.service";
import {ActivatedRoute} from "@angular/router";

export class RegularOrderView
	implements OrderViewPageType {
	constructor(public orderService: OrderService) {
	}

	getOrders() {
		let totalRequestRow;
		let orders;
		this.orderService.getOrdersDto(0, 50, "", "orderDate", 1, [], [],[],[],[]).subscribe(
			(data: any) => {
				orders = data.orderDtoList;
			}, error => {
				return null;
			}, () => {
				setTimeout(() => {
					return orders;
				}, 2000);
			})
	}
}

export class OrderViewForProduction
	implements OrderViewPageType {
	constructor(public orderService: OrderService) {
	}

	getOrders() {
		let orders;
		this.orderService.getOrdersDtoForProduction().subscribe(
			(data: any) => {
				orders = data;
			}, error => {
				return null;
			}, () => {
				return {orders}
			})
	}
}

export class OrderViewForStatistics
	implements OrderViewPageType {
	constructor(public orderService: OrderService, private activatedRoute: ActivatedRoute) {
	}

	getOrders() {
		let orders;
		let ordersNotFiltered;
		let basketIdTmp = this.activatedRoute.snapshot.paramMap.get('id');
		let startDateTmp = this.activatedRoute.snapshot.paramMap.get('startDate');
		let endDateTmp = this.activatedRoute.snapshot.paramMap.get('endDate');
		this.orderService.getOrdersByBasketIdAndOrderDateRange(basketIdTmp, startDateTmp, endDateTmp).subscribe(data => {
			orders = ordersNotFiltered = data;
		}, error => {
			return null;
		}, () => {
			return orders;
		})
	}
}

export class OrderViewForCustomers
	implements OrderViewPageType {
	constructor(public orderService: OrderService, private activatedRoute: ActivatedRoute) {
	}

	getOrders() {
		let orders;
		let ordersNotFiltered;
		let currentCustomerOnCustomerEditPage;
		this.orderService.getOrderByCustomer(this.activatedRoute.snapshot.params["id"]).subscribe(data => {
				orders = ordersNotFiltered = data;
				currentCustomerOnCustomerEditPage = this.activatedRoute.snapshot.params["id"];
			}, error => {
				return null;
			}
			, () => {
				return {orders, currentCustomerOnCustomerEditPage}
			}
		)
	}
}