import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../guard/auth.guard";
import {ModuleWithProviders} from "@angular/core";
import {ProductPickerComponent} from "./basket-creator/products-picker.component";
import {BasketExtAddComponentComponent} from "./basket-ext-add-component/basket-ext-add-component.component";
import {BasketExtComponentComponent} from "./basket-ext-component/basket-ext-component.component";
import {BasketComponent} from "./basket-view/basket-view.component";
import {GiftBasketEditComponent} from "./basket-edit/gift-basket-edit.component";

const routes: Routes = [
	{path: 'basket/:basketId', component: GiftBasketEditComponent, canActivate: [AuthGuard]},
	{path: 'baskets/add', component: ProductPickerComponent, canActivate: [AuthGuard]},
	{path: 'basketsext/add', component: BasketExtAddComponentComponent, canActivate: [AuthGuard]},
	{path: 'basketsext', component: BasketExtComponentComponent, canActivate: [AuthGuard]},
	{path: 'baskets', component: BasketComponent, canActivate: [AuthGuard]},

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);

