import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from "./admin.component";
import {AdminService} from "./admin.service";
import {ConfirmDialogModule, DataTableModule, DialogModule, FieldsetModule} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {routing} from './admin.routing';
import {BasketService} from "../basket/basket.service";

@NgModule({
	declarations: [AdminComponent],
	imports: [routing, CommonModule, FieldsetModule, DataTableModule, FormsModule, DialogModule, ConfirmDialogModule],
	providers: [AdminService,BasketService]
})
export class AdminModule {
}
