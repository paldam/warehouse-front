import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import {ProductsService} from './products/products.service';
import {HttpModule} from '@angular/http';
import { NavComponent } from './top-nav/top-nav.component';
import {LeftNavComponent} from './left-nav/left-nav.component';
import {PanelMenuModule, DataTableModule, SharedModule, FieldsetModule} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routing} from './app.routing';
import {ProductFormComponent} from './products/products-form/product-form.component';
import {FormsModule} from '@angular/forms'
import {ProductEditFormComponent} from './products/products-edit-form/product-edit-form.component';
import {ProductPickerComponent} from './gift-baskets/products-picker/products-picker.component';
import {GiftBasketComponent} from './gift-baskets/gift-baskets.component';
import {BasketSummaryComponent} from './gift-baskets/basket-form/basket-summary.component';
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
      BasketSummaryComponent
  ],
  imports: [
    BrowserModule,HttpModule,BrowserAnimationsModule,FormsModule,PanelMenuModule,DataTableModule,SharedModule,FieldsetModule,routing
  ],
  providers: [ProductsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
