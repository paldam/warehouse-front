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
import {BasketComponent} from "./basket/basket.component";
import {GiftBasketEditComponent} from "./gift-baskets/gift-basket-edit/gift-basket-edit.component";
import {AdminComponent} from "./admin/admin.component";
import {AdminGuard} from "./admin.guard";
import {TestComponent} from "./test/test.component";
const routes: Routes = [
    {path: '', component: ProductsComponent, pathMatch: 'full', canActivate: [AuthGuard]},
    { path: 'product', component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'product/add', component: ProductFormComponent , canActivate: [AuthGuard]},
    { path: 'product/:id', component: ProductEditFormComponent, canActivate: [AuthGuard] },
    { path: 'baskets/add', component: ProductPickerComponent, canActivate: [AuthGuard]},
    { path: 'baskets/order', component:BasketOrderComponent, canActivate: [AuthGuard]},
    {path:   'baskets', component: BasketComponent, canActivate: [AuthGuard] },
    {path:   'basket/:basketId', component: GiftBasketEditComponent, canActivate: [AuthGuard] },
    { path: 'orders', component:OrderComponent, canActivate: [AuthGuard]},
    {path:   'order/:id', component:OrderDetailsComponent, canActivate: [AuthGuard]},
    {path:   'test', component:TestComponent, canActivate: [AuthGuard]},
    {path:   'admin', component: AdminComponent,canActivate: [AuthGuard,AdminGuard]},
    {path:   'login', component: LoginComponent}
];
export const routing = RouterModule.forRoot(routes,{ useHash: true });



