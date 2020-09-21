import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from "./admin.component";
import {AdminService} from "./admin.service";
import {ConfirmDialogModule, DataTableModule, DialogModule, FieldsetModule, TabViewModule} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {routing} from './admin.routing';
import {BasketService} from "../basket/basket.service";
import {ProductsService} from "../products/products.service";

@NgModule({
	declarations: [AdminComponent],
	imports: [routing, CommonModule,TabViewModule, FieldsetModule, DataTableModule, FormsModule, DialogModule, ConfirmDialogModule],
	providers: [AdminService,BasketService,ProductsService]
})
export class AdminModule {
}
