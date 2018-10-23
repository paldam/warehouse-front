import { Routes, RouterModule } from '@angular/router';
import {ProductsComponent} from './products/product-view/products.component';
import {ProductFormComponent} from './products/products-add-form/product-form.component';
import {ProductEditFormComponent} from './products/products-edit-form/product-edit-form.component';
import {ProductPickerComponent} from './basket/basket-creator/products-picker.component';
import {BasketOrderComponent} from './order/basket-order/basket-order.component';
import {OrderComponent} from './order/order-view/order.component';
import {OrderDetailsComponent} from "./order/order-details/order-details.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guard/auth.guard";
import {BasketComponent} from "./basket/basket-view/basket-view.component";
import {GiftBasketEditComponent} from "./basket/basket-edit/gift-basket-edit.component";
import {AdminComponent} from "./admin/admin.component";
import {AdminGuard} from "./guard/admin.guard";
import {AdminOrSuperUserGuard} from "./guard/adminOrSuperUser.guard";
import {MapsComponent} from "./maps/maps.component";
import {StatisticComponent} from "./statistic/products-statistic/statistic.component";
import {FileSendComponent} from "./file-send/file-send.component";
import {CustomerComponent} from "./customer/customer-view/customer.component";
import {CustomerAddComponent} from "./customer/customer-add/customer-add.component";
import {CustomerEditComponent} from "./customer/customer-edit/customer-edit.component";
import {ProductDeliveryComponent} from "./products/product-delivery/product-delivery.component";
import {BasketStatisticComponent} from "./statistic/basket-statistic/basket-statistic.component";
import {BasketExtComponentComponent} from './basket/basket-ext-component/basket-ext-component.component';
import {BasketExtAddComponentComponent} from './basket/basket-ext-add-component/basket-ext-add-component.component';
import {NotesComponent} from "./notes/notes.component";
const routes: Routes = [
    {path: '', component: ProductsComponent, pathMatch: 'full', canActivate: [AuthGuard]},
    { path: 'product', component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'product/add', component: ProductFormComponent , canActivate: [AuthGuard]},
    { path: 'product/:id', component: ProductEditFormComponent, canActivate: [AuthGuard] },
    { path: 'baskets/add', component: ProductPickerComponent, canActivate: [AuthGuard]},
    { path: 'basketsext/add', component: BasketExtAddComponentComponent, canActivate: [AuthGuard]},
    { path: 'basketsext', component: BasketExtComponentComponent, canActivate: [AuthGuard]},
    { path: 'baskets/order', component:BasketOrderComponent, canActivate: [AuthGuard]},

    {path:   'baskets', component: BasketComponent, canActivate: [AuthGuard] },
    {path:   'basket/:basketId', component: GiftBasketEditComponent, canActivate: [AuthGuard] },
    { path: 'orders', component:OrderComponent, canActivate: [AuthGuard]},
    {path:   'order/:id', component:OrderDetailsComponent, canActivate: [AuthGuard]},
    {path:   'admin', component: AdminComponent,canActivate: [AuthGuard,AdminGuard]},
    {path:   'maps', component: MapsComponent,canActivate: [AuthGuard]},
    {path:   'statistics/products', component: StatisticComponent,canActivate: [AuthGuard]},
    {path:   'statistics/basket', component: BasketStatisticComponent,canActivate: [AuthGuard]},
    {path:   'notes', component: NotesComponent,canActivate: [AuthGuard]},
    {path:   'login', component: LoginComponent},
    {path:   'file', component: FileSendComponent},
    {path:   'customer', component: CustomerComponent},
    {path:   'customer/add', component: CustomerAddComponent},
    {path:   'customer/:id', component: CustomerEditComponent},
    {path:   'products/delivery', component: ProductDeliveryComponent},
    {path:   'products/setdelivery', component: ProductDeliveryComponent}
];
export const routing = RouterModule.forRoot(routes,{ useHash: true });



