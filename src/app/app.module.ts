import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './main-app-component/app.component';
import { ProductsComponent } from './products/products.component';
import {ProductsService} from './products/products.service';
import {HttpModule, RequestOptions, XHRBackend} from '@angular/http';
import { NavComponent } from './nav-bars/top-nav/top-nav.component';
import {LeftNavComponent} from './nav-bars/left-nav/left-nav.component';
import {
  PanelMenuModule, DataTableModule, SharedModule, FieldsetModule, OverlayPanelModule, LightboxModule,
  PanelModule, ConfirmationService, ConfirmDialogModule, DialogModule, CalendarModule, ContextMenuModule, MenuModule
} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routing} from './app.routing';
import {ProductFormComponent} from './products/products-add-form/product-form.component';
import {FormsModule} from '@angular/forms'
import {ProductEditFormComponent} from './products/products-edit-form/product-edit-form.component';
import {ProductPickerComponent} from './basket/basket-creator/products-picker.component';
import {GiftBasketComponent} from './basket/basket-helper-list/gift-baskets.component';
import {BasketService} from './basket/gift-basket.service';
import {BasketOrderComponent} from './order/basket-order/basket-order.component';
import {CustomerService} from './customer/customer.service';
import {OrderService} from './order/order.service';
import {OrderComponent} from './order/order-view/order.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from "./auth.guard";
import {AuthenticationService} from "./authentication.service";
import { BasketComponent } from './basket/basket-view/basket-view.component';
import {HttpService} from "./http-service";
import {Router} from "@angular/router";
import { GiftBasketEditComponent } from './basket/basket-edit/gift-basket-edit.component';
import { AdminComponent } from './admin/admin.component';
import {AdminGuard} from "./admin.guard";
import {UserService} from "./user.service";
import {AdminOrSuperUserGuard} from "./adminOrSuperUser.guard";
import {PageNotFoundComponent} from "./pageNotFound.component";
import { MapsComponent } from './maps/maps.component';
import {MapService} from "./maps/map.service";
import { StatisticComponent } from './statistic/statistic.component';
import {CalendarSetingsComponent} from "./primeNgCalendarSetings/calendarStings.component";
import {TableModule} from "primeng/table";
import { FileSendComponent } from './file-send/file-send.component';
import {FileUploadModule} from 'primeng/fileupload';
import {FileSendService} from "./file-send/file-send.service";
import { CustomerComponent } from './customer/customer-view/customer.component';
import { CustomerAddComponent } from './customer/customer-add/customer-add.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';



export function httpExt(backend: XHRBackend, options: RequestOptions, router: Router) {
  return new HttpService(backend, options, router);
}

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    NavComponent,
    LeftNavComponent,
    ProductFormComponent,
    ProductEditFormComponent,
      ProductPickerComponent,
      GiftBasketComponent,
      BasketOrderComponent,
      OrderComponent,
      OrderDetailsComponent,
      LoginComponent,
      BasketComponent,
      GiftBasketEditComponent,
      AdminComponent,
    PageNotFoundComponent,
    MapsComponent,
    StatisticComponent,
    FileSendComponent,
    CustomerComponent,
    CustomerAddComponent,
    CustomerEditComponent,

  ],
  imports: [
    BrowserModule,HttpModule,BrowserAnimationsModule,FormsModule,DialogModule,ConfirmDialogModule,PanelMenuModule,
    PanelModule,TableModule,FileUploadModule,DataTableModule,SharedModule,FieldsetModule,LightboxModule,OverlayPanelModule,ContextMenuModule, MenuModule,CalendarModule,routing
  ],
  providers: [ {
    provide: HttpService, useFactory: (httpExt) , deps: [XHRBackend, RequestOptions,Router]},
    CalendarSetingsComponent,ProductsService,BasketService,CustomerService,FileSendService,CustomerService,OrderService,MapService,ConfirmationService,AuthGuard,AdminGuard,AdminOrSuperUserGuard,AuthenticationService,UserService],

  bootstrap: [AppComponent]
})
export class AppModule { }
