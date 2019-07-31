import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BasketOrderComponent} from "./basket-order/basket-order.component";
import {AuthGuard} from "../guard/auth.guard";
import {OrderComponent} from "./order-view/order.component";
import {OrderDetailsComponent} from "./order-details/order-details.component";
import {OrderAuditComponent} from "./order-audit/order-audit.component";
import {OrderViewProductionComponent} from "./order-view-production/order-view-production.component";

const routes: Routes = [
	{path: 'orders/audit', component: OrderAuditComponent, canActivate: [AuthGuard]},
	{path: 'orders/baskets', component: BasketOrderComponent, canActivate: [AuthGuard]},
	{path: 'orders/all', component: OrderComponent, canActivate: [AuthGuard]},
	{path: 'orders/production', component: OrderViewProductionComponent, canActivate: [AuthGuard]},
	{path: 'orders/:id', component: OrderDetailsComponent, canActivate: [AuthGuard]},
	{path: 'orders/copy/:id', component: OrderDetailsComponent, canActivate: [AuthGuard]}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);