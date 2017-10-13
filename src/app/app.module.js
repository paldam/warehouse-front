"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_component_1 = require("./app.component");
var products_component_1 = require("./products/products.component");
var products_service_1 = require("./products/products.service");
var http_1 = require("@angular/http");
var top_nav_component_1 = require("./top-nav/top-nav.component");
var left_nav_component_1 = require("./left-nav/left-nav.component");
var primeng_1 = require("primeng/primeng");
var animations_1 = require("@angular/platform-browser/animations");
var app_routing_1 = require("./app.routing");
var product_form_component_1 = require("./products/products-add-form/product-form.component");
var forms_1 = require("@angular/forms");
var product_edit_form_component_1 = require("./products/products-edit-form/product-edit-form.component");
var products_picker_component_1 = require("./gift-baskets/products-picker/products-picker.component");
var gift_baskets_component_1 = require("./gift-baskets/gift-baskets.component");
var gift_basket_service_1 = require("./gift-baskets/gift-basket.service");
var basket_order_component_1 = require("./gift-baskets/gift-baskets-order/basket-order.component");
var customer_service_1 = require("./gift-baskets/gift-baskets-order/customer.service");
var order_service_1 = require("./order/order.service");
var order_component_1 = require("./order/order.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            products_component_1.ProductsComponent,
            top_nav_component_1.NavComponent,
            left_nav_component_1.LeftNavComponent,
            product_form_component_1.ProductFormComponent,
            product_edit_form_component_1.ProductEditFormComponent,
            products_picker_component_1.ProductPickerComponent,
            gift_baskets_component_1.GiftBasketComponent,
            basket_order_component_1.BasketOrderComponent,
            order_component_1.OrderComponent
        ],
        imports: [
            platform_browser_1.BrowserModule, http_1.HttpModule, animations_1.BrowserAnimationsModule, forms_1.FormsModule, primeng_1.PanelMenuModule, primeng_1.PanelModule, primeng_1.DataTableModule, primeng_1.SharedModule, primeng_1.FieldsetModule, primeng_1.LightboxModule, primeng_1.OverlayPanelModule, app_routing_1.routing
        ],
        providers: [products_service_1.ProductsService, gift_basket_service_1.BasketService, customer_service_1.CustomerService, order_service_1.OrderService],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map