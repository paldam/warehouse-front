import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PrimeNgModule} from "../prime-ng.module";
import {ProductsService} from "./products.service";
import {ProductDeliveryComponent} from "./product-delivery/product-delivery.component";
import {ProductEditFormComponent} from "./products-edit-form/product-edit-form.component";
import {ProductFormComponent} from "./products-add-form/product-form.component";
import {ProductsComponent} from "./product-view/products.component";
import {routing} from "./products.routing";
import {SuppliersComponent} from "./suppliers/suppliers.component";
import {SuppliersService} from "./suppliers.service";
import { ProductsCategoryComponent } from './products-category/products-category.component';

@NgModule({
	declarations: [ProductDeliveryComponent,ProductsComponent,ProductFormComponent,ProductEditFormComponent,
		SuppliersComponent, ProductsCategoryComponent],
	imports: [routing,CommonModule,PrimeNgModule],
	providers: [ProductsService,SuppliersService],
	exports:[ProductsComponent]
})
export class ProductsModule {
}
