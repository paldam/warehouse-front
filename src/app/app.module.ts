import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import {ProductsService} from './products/products.service';
import {HttpModule} from '@angular/http';
import { NavComponent } from './nav/nav.component';
import {LeftNavComponent} from "./left_nav/left_nav.componeent";
import {MenuModule} from 'primeng/primeng';
@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    NavComponent,
    LeftNavComponent
  ],
  imports: [
    BrowserModule,HttpModule,MenuModule
  ],
  providers: [ProductsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
