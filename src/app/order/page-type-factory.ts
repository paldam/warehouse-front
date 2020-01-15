import {RoutingState} from "../routing-stage";
import {OrderViewPageType} from "./order-view-page-type";
import {OrderViewForCustomers, OrderViewForProduction, OrderViewForStatistics, RegularOrderView} from "./page-types";
import {OrderService} from "./order.service";
import {ActivatedRoute} from "@angular/router";

export class PageTypeFactory {
	constructor(public routingState: RoutingState) {
	}

	public static createPageType(activatedRoute: ActivatedRoute, routingState: RoutingState, orderService: OrderService): OrderViewPageType {
		if (routingState.getCurrentPage().substring(0, 9) == "/customer") {
			return new OrderViewForCustomers(orderService, activatedRoute);
		}
		if (routingState.getCurrentPage().substring(0, 11) == "/orders/all") {
			return new RegularOrderView(orderService);
		}
		if (routingState.getCurrentPage().substring(0, 14) == "/orders/all;id") {
			return new OrderViewForStatistics(orderService, activatedRoute);
		}
		if (routingState.getCurrentPage().substring(0, 18) == "/orders/production") {
			return new OrderViewForProduction(orderService);
		}
	}
}