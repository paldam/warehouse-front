import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../guard/auth.guard";
import {ModuleWithProviders} from "@angular/core";
import {ProductDeliveryComponent} from "./product-delivery/product-delivery.component";
import {ProductFormComponent} from "./products-add-form/product-form.component";
import {ProductEditFormComponent} from "./products-edit-form/product-edit-form.component";
import {ProductsComponent} from "./product-view/products.component";
import {SuppliersComponent} from "./suppliers/suppliers.component";
import {ProductsCategoryComponent} from "./products-category/products-category.component";

const routes: Routes = [
	{path: '', component: ProductsComponent, pathMatch: 'full', canActivate: [AuthGuard]},
	{path: 'products/delivery', component: ProductDeliveryComponent, canActivate: [AuthGuard]},
	{path: 'products/setdelivery', component: ProductDeliveryComponent, canActivate: [AuthGuard]},
	{path: 'product', component: ProductsComponent, canActivate: [AuthGuard]},
	{path: 'product/add', component: ProductFormComponent, canActivate: [AuthGuard]},
	{path: 'product/detail/:id', component: ProductEditFormComponent, canActivate: [AuthGuard]},
	{path: 'products/suppliers', component: SuppliersComponent},
	{path: 'products/category', component: ProductsCategoryComponent}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);



