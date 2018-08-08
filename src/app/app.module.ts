import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import {ProductsService} from './products/products.service';
import {HttpModule, RequestOptions, XHRBackend} from '@angular/http';
import { NavComponent } from './top-nav/top-nav.component';
import {LeftNavComponent} from './left-nav/left-nav.component';
import {
  PanelMenuModule, DataTableModule, SharedModule, FieldsetModule, OverlayPanelModule, LightboxModule,
  PanelModule, ConfirmationService, ConfirmDialogModule, DialogModule, CalendarModule
} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routing} from './app.routing';
import {ProductFormComponent} from './products/products-add-form/product-form.component';
import {FormsModule} from '@angular/forms'
import {ProductEditFormComponent} from './products/products-edit-form/product-edit-form.component';
import {ProductPickerComponent} from './gift-baskets/products-picker/products-picker.component';
import {GiftBasketComponent} from './gift-baskets/gift-baskets.component';
import {BasketService} from './gift-baskets/gift-basket.service';
import {BasketOrderComponent} from './gift-baskets/gift-baskets-order/basket-order.component';
import {CustomerService} from './gift-baskets/gift-baskets-order/customer.service';
import {OrderService} from './order/order.service';
import {OrderComponent} from './order/order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from "./auth.guard";
import {AuthenticationService} from "./authentication.service";
import { BasketComponent } from './basket/basket.component';
import {HttpService} from "./http-service";
import {Router} from "@angular/router";
import { GiftBasketEditComponent } from './gift-baskets/gift-basket-edit/gift-basket-edit.component';
import { AdminComponent } from './admin/admin.component';
import {AdminGuard} from "./admin.guard";
import { TestComponent } from './test/test.component';
import {UserService} from "./user.service";
import {AdminOrSuperUserGuard} from "./adminOrSuperUser.guard";
import {PageNotFoundComponent} from "./pageNotFound.component";
import { MapsComponent } from './maps/maps.component';
import {MapService} from "./maps/map.service";
import { StatisticComponent } from './statistic/statistic.component';
import {CalendarSetingsComponent} from "./primeNgCalendarSetings/calendarStings.component";



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
      TestComponent,
    PageNotFoundComponent,
    MapsComponent,
    StatisticComponent,
  ],
  imports: [
    BrowserModule,HttpModule,BrowserAnimationsModule,FormsModule,DialogModule,ConfirmDialogModule,PanelMenuModule,
    PanelModule,DataTableModule,SharedModule,FieldsetModule,LightboxModule,OverlayPanelModule,CalendarModule,routing
  ],
  providers: [ {
    provide: HttpService, useFactory: (httpExt) , deps: [XHRBackend, RequestOptions,Router]},
    CalendarSetingsComponent,ProductsService,BasketService,CustomerService,OrderService,MapService,ConfirmationService,AuthGuard,AdminGuard,AdminOrSuperUserGuard,AuthenticationService,UserService],

  bootstrap: [AppComponent]
})
export class AppModule { }
