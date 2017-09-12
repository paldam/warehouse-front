import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import {ProductsService} from './products/products.service';
import {HttpModule} from '@angular/http';
import { NavComponent } from './top-nav/top-nav.component';
import {LeftNavComponent} from './left-nav/left-nav.component';
import {PanelMenuModule} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routing} from './app.routing';
import {TestComponent} from './test/test.component';
import {ProductFormComponent} from './products/products-form/product-form.component';
import {FormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    NavComponent,
    LeftNavComponent,
    TestComponent,
      ProductFormComponent,
  ],
  imports: [
    BrowserModule,HttpModule,PanelMenuModule,BrowserAnimationsModule,FormsModule,routing
  ],
  providers: [ProductsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
