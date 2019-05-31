import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PrimeNgModule} from "../prime-ng.module";
import {OrderStatsComponent} from "./order-stat/order-stats.component";
import {Statistic2Component} from "./products-statistic2/statistic2.component";
import {StatisticComponent} from "./products-statistic/statistic.component";
import {BasketStatisticComponent} from "./basket-statistic/basket-statistic.component";
import {routing} from "./statistic.routing";
import {ProductsService} from "../products/products.service";
import {BasketService} from "../basket/basket.service";
import {OrderService} from "../order/order.service";


@NgModule({
	declarations: [BasketStatisticComponent, OrderStatsComponent, StatisticComponent, Statistic2Component],
	imports: [routing, CommonModule, PrimeNgModule],
	providers: [ProductsService,BasketService,OrderService],
})
export class StatisticModule {
}
