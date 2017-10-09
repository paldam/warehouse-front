import { Routes, RouterModule } from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {ProductFormComponent} from './products/products-add-form/product-form.component';
import {ProductEditFormComponent} from './products/products-edit-form/product-edit-form.component';
import {ProductPickerComponent} from './gift-baskets/products-picker/products-picker.component';
import {BasketOrderComponent} from './gift-baskets/gift-baskets-order/basket-order.component';
import {OrderComponent} from './order/order.component';
const routes: Routes = [
    { path: 'product', component: ProductsComponent },
    { path: 'product/add', component: ProductFormComponent },
    { path: 'product/:id', component: ProductEditFormComponent },
    { path: 'baskets/add', component: ProductPickerComponent},
    { path: 'baskets/order', component:BasketOrderComponent},
    { path: 'orders', component:OrderComponent}
];
export const routing = RouterModule.forRoot(routes);
