import { Routes, RouterModule } from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {ProductFormComponent} from './products/products-add-form/product-form.component';
import {ProductEditFormComponent} from './products/products-edit-form/product-edit-form.component';
import {ProductPickerComponent} from './gift-baskets/products-picker/products-picker.component';
import {BasketOrderComponent} from './gift-baskets/gift-baskets-order/basket-order.component';
import {OrderComponent} from './order/order.component';
import {OrderDetailsComponent} from "./order-details/order-details.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
const routes: Routes = [
    { path: 'product', component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'product/add', component: ProductFormComponent , canActivate: [AuthGuard]},
    { path: 'product/:id', component: ProductEditFormComponent, canActivate: [AuthGuard] },
    { path: 'baskets/add', component: ProductPickerComponent, canActivate: [AuthGuard]},
    { path: 'baskets/order', component:BasketOrderComponent, canActivate: [AuthGuard]},
    { path: 'orders', component:OrderComponent, canActivate: [AuthGuard]},
    {path:   'order/:id', component:OrderDetailsComponent, canActivate: [AuthGuard]},
    {path:   'login/', component: LoginComponent}
];
export const routing = RouterModule.forRoot(routes,{ useHash: true });
