import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../guard/auth.guard";
import {ModuleWithProviders} from "@angular/core";
import {StatisticComponent} from "./products-statistic/statistic.component";
import {Statistic2Component} from "./products-statistic2/statistic2.component";
import {BasketStatisticComponent} from "./basket-statistic/basket-statistic.component";
import {OrderStatsComponent} from "./order-stat/order-stats.component";

const routes: Routes = [
	{path: 'statistics/products', component: StatisticComponent, canActivate: [AuthGuard]},
	{path: 'statistics/products2', component: Statistic2Component, canActivate: [AuthGuard]},
	{path: 'statistics/basket', component: BasketStatisticComponent, canActivate: [AuthGuard]},
	{path: 'statistics/orderstats', component: OrderStatsComponent, canActivate: [AuthGuard]},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);