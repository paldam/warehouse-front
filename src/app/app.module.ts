import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './main-app-component/app.component';
import { ProductsComponent } from './products/product-view/products.component';
import {ProductsService} from './products/products.service';
import {HttpModule, RequestOptions, XHRBackend} from '@angular/http';
import { NavComponent } from './nav-bars/top-nav/top-nav.component';
import {LeftNavComponent} from './nav-bars/left-nav/left-nav.component';
import {
    PanelMenuModule,
    DataTableModule,
    SharedModule,
    FieldsetModule,
    OverlayPanelModule,
    LightboxModule,
    PanelModule,
    ConfirmationService,
    ConfirmDialogModule,
    DialogModule,
    ContextMenuModule,
    MenuModule,
    RadioButtonModule,
    DropdownModule,
    SpinnerModule,
    CheckboxModule,
    CardModule,
    ProgressSpinnerModule,
    MultiSelectModule,
} from 'primeng/primeng';

import {CalendarModule} from 'primeng/calendar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routing} from './app.routing';
import {ProductFormComponent} from './products/products-add-form/product-form.component';
import {FormsModule} from '@angular/forms'
import {ProductEditFormComponent} from './products/products-edit-form/product-edit-form.component';
import {ProductPickerComponent} from './basket/basket-creator/products-picker.component';
import {GiftBasketComponent} from './basket/basket-helper-list/gift-baskets.component';
import {BasketService} from './basket/basket.service';
import {BasketOrderComponent} from './order/basket-order/basket-order.component';
import {CustomerService} from './customer/customer.service';
import {OrderService} from './order/order.service';
import {OrderComponent} from './order/order-view/order.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from "./guard/auth.guard";
import {AuthenticationService} from "./authentication.service";
import { BasketComponent } from './basket/basket-view/basket-view.component';
import {HttpService} from "./http-service";
import {Router} from "@angular/router";
import { GiftBasketEditComponent } from './basket/basket-edit/gift-basket-edit.component';
import { AdminComponent } from './admin/admin.component';
import {AdminGuard} from "./guard/admin.guard";
import {UserService} from "./user.service";
import {AdminOrSuperUserGuard} from "./guard/adminOrSuperUser.guard";
import {PageNotFoundComponent} from "./pageNotFound.component";
import { MapsComponent } from './maps/maps.component';
import {MapService} from "./maps/map.service";
import { StatisticComponent } from './statistic/products-statistic/statistic.component';
import {CalendarSetingsComponent} from "./primeNgCalendarSetings/calendarStings.component";
import {TableModule} from "primeng/table";
import { FileSendComponent } from './file-send/file-send.component';
import {FileUploadModule} from 'primeng/fileupload';
import {FileSendService} from "./file-send/file-send.service";
import { CustomerComponent } from './customer/customer-view/customer.component';
import { CustomerAddComponent } from './customer/customer-add/customer-add.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import {ToastModule} from "primeng/toast";
import {MenuItem, MessageService} from "primeng/api";
import {MessageServiceExt} from './messages/messageServiceExt';
import {ListboxModule} from "primeng/listbox";
import { ProductDeliveryComponent } from './products/product-delivery/product-delivery.component';
import { BasketStatisticComponent } from './statistic/basket-statistic/basket-statistic.component';
import { BasketExtComponentComponent } from './basket/basket-ext-component/basket-ext-component.component';
import { BasketExtAddComponentComponent } from './basket/basket-ext-add-component/basket-ext-add-component.component';
import {BasketExtService} from './basket/basket-ext.service';
import { NotesComponent } from './notes/notes.component';
import {NotesService} from "./notes/notes-service";
import {OrderStatsComponent} from "./statistic/order-stat/order-stats.component";
import {Statistic2Component} from "./statistic/products-statistic2/statistic2.component";
import {AdminService} from "./admin/admin.service";
import {SuppliersComponent} from "./suppliers/suppliers.component";
import {RoutingState} from "./routing-stage";
import { OrderAuditComponent } from './order-audit/order-audit.component';



export function httpExt(backend: XHRBackend, options: RequestOptions, router: Router, messageService :MessageService) {
  return new HttpService(backend, options, router, messageService);
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
      OrderStatsComponent,
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
      Statistic2Component,
    FileSendComponent,
    CustomerComponent,
    CustomerAddComponent,
    CustomerEditComponent,
    ProductDeliveryComponent,
    BasketStatisticComponent,
    BasketExtComponentComponent,
    BasketExtAddComponentComponent,
    NotesComponent,
    SuppliersComponent,
    OrderAuditComponent,

  ],
  imports: [
    BrowserModule,HttpModule,BrowserAnimationsModule,FormsModule,DialogModule,CheckboxModule,ConfirmDialogModule,PanelMenuModule,
    PanelModule,DropdownModule,ListboxModule,RadioButtonModule,ToastModule,TableModule,FileUploadModule,DataTableModule,
    SharedModule,MultiSelectModule,SpinnerModule,CardModule,ProgressSpinnerModule,FieldsetModule,LightboxModule,OverlayPanelModule,ContextMenuModule, MenuModule,CalendarModule, routing
  ],
  providers: [ {
    provide: HttpService, useFactory: (httpExt) , deps: [XHRBackend, RequestOptions,Router,MessageService]},
    CalendarSetingsComponent,MessageServiceExt,AdminService,RoutingState, NotesService,MessageService,ProductsService,BasketService,BasketExtService,CustomerService,FileSendService,CustomerService,OrderService,MapService,ConfirmationService,AuthGuard,AdminGuard,AdminOrSuperUserGuard,AuthenticationService,UserService],

  bootstrap: [AppComponent]
})
export class AppModule { }
