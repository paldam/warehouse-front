import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrderComponent} from "./order-view/order.component";
import {BasketOrderComponent} from "./basket-order/basket-order.component";
import {OrderDetailsComponent} from "./order-details/order-details.component";
import {OrderPreviewComponent} from "./order-preview/order-preview.component";
import {PrimeNgModule} from "../prime-ng.module";
import {routing} from "./order.routing";
import {OrderService} from "./order.service";
import {OrderAuditComponent} from "./order-audit/order-audit.component";



@NgModule({
	declarations: [OrderComponent,BasketOrderComponent,OrderDetailsComponent,OrderPreviewComponent,OrderAuditComponent],
	imports: [routing,CommonModule,PrimeNgModule],
	providers: [OrderService]
})
export class OrderModule {
}
