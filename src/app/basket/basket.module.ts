import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PrimeNgModule} from "../prime-ng.module";
import {routing} from "./basket.routing";
import {ProductPickerComponent} from "./basket-creator/products-picker.component";
import {BasketExtAddComponentComponent} from "./basket-ext-add-component/basket-ext-add-component.component";
import {BasketExtComponentComponent} from "./basket-ext-component/basket-ext-component.component";
import {GiftBasketEditComponent} from "./basket-edit/gift-basket-edit.component";
import {GiftBasketComponent} from "./basket-helper-list/gift-baskets.component";
import {BasketComponent} from "./basket-view/basket-view.component";
import {BasketService} from "./basket.service";
import {BasketExtService} from "./basket-ext.service";
import {ProductsComponent} from "../products/product-view/products.component";
import {ProductsModule} from "../products/products.module";

@NgModule({
	declarations: [ProductPickerComponent,GiftBasketEditComponent,BasketExtAddComponentComponent,BasketExtComponentComponent,GiftBasketComponent,BasketComponent],
	imports: [routing,CommonModule,PrimeNgModule,ProductsModule],
	providers: [BasketService,BasketExtService]
})
export class BasketModule {
}