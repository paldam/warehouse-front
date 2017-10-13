"use strict";
var router_1 = require("@angular/router");
var products_component_1 = require("./products/products.component");
var product_form_component_1 = require("./products/products-add-form/product-form.component");
var product_edit_form_component_1 = require("./products/products-edit-form/product-edit-form.component");
var products_picker_component_1 = require("./gift-baskets/products-picker/products-picker.component");
var basket_order_component_1 = require("./gift-baskets/gift-baskets-order/basket-order.component");
var order_component_1 = require("./order/order.component");
var routes = [
    { path: 'product', component: products_component_1.ProductsComponent },
    { path: 'product/add', component: product_form_component_1.ProductFormComponent },
    { path: 'product/:id', component: product_edit_form_component_1.ProductEditFormComponent },
    { path: 'baskets/add', component: products_picker_component_1.ProductPickerComponent },
    { path: 'baskets/order', component: basket_order_component_1.BasketOrderComponent },
    { path: 'orders', component: order_component_1.OrderComponent }
];
exports.routing = router_1.RouterModule.forRoot(routes);
//# sourceMappingURL=app.routing.js.map