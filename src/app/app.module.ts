import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import {ProductsService} from './products/products.service';
import {HttpModule} from '@angular/http';
import { NavComponent } from './top-nav/top-nav.component';
import {LeftNavComponent} from './left-nav/left-nav.component';
import {
  PanelMenuModule, DataTableModule, SharedModule, FieldsetModule, OverlayPanelModule, LightboxModule,
  PanelModule, ConfirmationService, ConfirmDialogModule
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
      OrderComponent
  ],
  imports: [
    BrowserModule,HttpModule,BrowserAnimationsModule,FormsModule,ConfirmDialogModule,PanelMenuModule,PanelModule,DataTableModule,SharedModule,FieldsetModule,LightboxModule,OverlayPanelModule,routing
  ],
  providers: [ProductsService,BasketService,CustomerService,OrderService,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
