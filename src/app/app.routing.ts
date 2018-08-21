import { Routes, RouterModule } from '@angular/router';
import {ProductsComponent} from './products/product-view/products.component';
import {ProductFormComponent} from './products/products-add-form/product-form.component';
import {ProductEditFormComponent} from './products/products-edit-form/product-edit-form.component';
import {ProductPickerComponent} from './basket/basket-creator/products-picker.component';
import {BasketOrderComponent} from './order/basket-order/basket-order.component';
import {OrderComponent} from './order/order-view/order.component';
import {OrderDetailsComponent} from "./order/order-details/order-details.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {BasketComponent} from "./basket/basket-view/basket-view.component";
import {GiftBasketEditComponent} from "./basket/basket-edit/gift-basket-edit.component";
import {AdminComponent} from "./admin/admin.component";
import {AdminGuard} from "./admin.guard";
import {AdminOrSuperUserGuard} from "./adminOrSuperUser.guard";
import {MapsComponent} from "./maps/maps.component";
import {StatisticComponent} from "./statistic/statistic.component";
import {FileSendComponent} from "./file-send/file-send.component";
import {CustomerComponent} from "./customer/customer-view/customer.component";
import {CustomerAddComponent} from "./customer/customer-add/customer-add.component";
import {CustomerEditComponent} from "./customer/customer-edit/customer-edit.component";
const routes: Routes = [
    {path: '', component: ProductsComponent, pathMatch: 'full', canActivate: [AuthGuard,AdminOrSuperUserGuard]},
    { path: 'product', component: ProductsComponent, canActivate: [AuthGuard,AdminOrSuperUserGuard] },
    { path: 'product/add', component: ProductFormComponent , canActivate: [AuthGuard,AdminOrSuperUserGuard]},
    { path: 'product/:id', component: ProductEditFormComponent, canActivate: [AuthGuard,AdminOrSuperUserGuard] },
    { path: 'baskets/add', component: ProductPickerComponent, canActivate: [AuthGuard,AdminOrSuperUserGuard]},
    { path: 'baskets/order', component:BasketOrderComponent, canActivate: [AuthGuard]},
    {path:   'baskets', component: BasketComponent, canActivate: [AuthGuard,AdminOrSuperUserGuard] },
    {path:   'basket/:basketId', component: GiftBasketEditComponent, canActivate: [AuthGuard,AdminOrSuperUserGuard] },
    { path: 'orders', component:OrderComponent, canActivate: [AuthGuard]},
    {path:   'order/:id', component:OrderDetailsComponent, canActivate: [AuthGuard]},
    {path:   'admin', component: AdminComponent,canActivate: [AuthGuard,AdminGuard]},
    {path:   'maps', component: MapsComponent,canActivate: [AuthGuard,AdminGuard]},
    {path:   'statistics', component: StatisticComponent,canActivate: [AuthGuard,AdminGuard]},
    {path:   'login', component: LoginComponent},
    {path:   'file', component: FileSendComponent},
    {path:   'customer', component: CustomerComponent},
    {path:   'customer/add', component: CustomerAddComponent},
    {path:   'customer/:id', component: CustomerEditComponent},
];
export const routing = RouterModule.forRoot(routes,{ useHash: true });



