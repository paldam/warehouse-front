import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BasketOrderComponent} from "./basket-order/basket-order.component";
import {AuthGuard} from "../guard/auth.guard";
import {OrderComponent} from "./order-view/order.component";
import {OrderDetailsComponent} from "./order-details/order-details.component";
import {OrderAuditComponent} from "./order-audit/order-audit.component";

const routes: Routes = [
	{path: 'audit', component: OrderAuditComponent, canActivate: [AuthGuard]},
	{path: 'baskets', component: BasketOrderComponent, canActivate: [AuthGuard]},
	{path: 'all', component: OrderComponent, canActivate: [AuthGuard]},
	{path: ':id', component: OrderDetailsComponent, canActivate: [AuthGuard]}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);