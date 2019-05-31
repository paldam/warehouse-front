import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PrimeNgModule} from "../prime-ng.module";
import {OrderService} from "../order/order.service";
import {CustomerEditComponent} from "./customer-edit/customer-edit.component";
import {CustomerComponent} from "./customer-view/customer.component";
import {routing} from "./customer.routing";
import {OrderModule} from "../order/order.module";
import {OrderComponent} from "../order/order-view/order.component";
import {OrderPreviewComponent} from "../order/order-preview/order-preview.component";
import {CustomerService} from "./customer.service";
import {SharedModule} from "primeng/shared";

@NgModule({
	declarations: [CustomerEditComponent,CustomerComponent],
	imports: [routing,SharedModule,CommonModule,PrimeNgModule,OrderModule],
	providers: [OrderService,CustomerService]
})
export class CustomerModule {
}
