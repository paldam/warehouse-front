import { Routes, RouterModule } from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {ProductFormComponent} from './products/products-add-form/product-form.component';
import {ProductEditFormComponent} from './products/products-edit-form/product-edit-form.component';
import {GiftBasketComponent} from './gift-baskets/gift-baskets.component';
const routes: Routes = [
    { path: 'product', component: ProductsComponent },
    { path: 'product/add', component: ProductFormComponent },
    { path: 'product/:id', component: ProductEditFormComponent },
    { path: 'baskets', component: GiftBasketComponent },
];
export const routing = RouterModule.forRoot(routes);
