"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var products_service_1 = require("../../products/products.service");
var basket_items_model_1 = require("../../model/basket_items.model");
var basket_model_1 = require("../../model/basket.model");
var gift_basket_service_1 = require("../gift-basket.service");
var gift_baskets_component_1 = require("../gift-baskets.component");
var ProductPickerComponent = (function () {
    function ProductPickerComponent(productsService, basketService) {
        var _this = this;
        this.productsService = productsService;
        this.basketService = basketService;
        this.products = [];
        this.basketItems = [];
        this.basketTypes = [];
        this.basket = new basket_model_1.Basket();
        this.total = 0;
        this.markUp = 10;
        this.formSubmitted = false;
        productsService.getProducts().subscribe(function (data) { return _this.products = data; });
        basketService.getBasketsTypes().subscribe(function (data) { return _this.basketTypes = data; });
    }
    ProductPickerComponent.prototype.addProductToGiftBasket = function (product) {
        var line = this.basketItems.find(function (data) { return data.product.id == product.id; });
        if (line == undefined) {
            this.basketItems.push(new basket_items_model_1.BasketItems(product, 1));
        }
        else {
            line.quantity = line.quantity + 1;
        }
        this.recalculate();
    };
    ProductPickerComponent.prototype.isProductLinesEmpty = function () {
        if (this.basketItems.length == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    ProductPickerComponent.prototype.updateQuantity = function (productLine, quantity) {
        var line = this.basketItems.find(function (line) { return line.product.id == productLine.product.id; });
        if (line != undefined) {
            line.quantity = Number(quantity);
        }
        this.recalculate();
    };
    ProductPickerComponent.prototype.deleteProductLine = function (id) {
        var index = this.basketItems.findIndex(function (data) { return data.product.id == id; });
        if (index > -1) {
            this.basketItems.splice(index, 1);
        }
        this.recalculate();
    };
    ProductPickerComponent.prototype.recalculate = function () {
        var _this = this;
        this.total = 0;
        this.basketItems.forEach(function (data) {
            _this.total += data.product.price * data.quantity;
        });
    };
    ProductPickerComponent.prototype.submitForm = function (form) {
        var _this = this;
        this.formSubmitted = true;
        if (form.valid && this.basketItems.length > 0) {
            this.basket.basketItems = this.basketItems;
            this.basket.basketTotalPrice = this.total;
            console.log(JSON.stringify(this.basket));
            this.basketService.saveBasket(this.basket).subscribe(function (data) {
                _this.basket = new basket_model_1.Basket();
                _this.basketItems = [];
                form.resetForm();
                _this.formSubmitted = false;
                _this.recalculate();
                _this.giftBasketComponent.refreshData();
            }, function (err) { return console.log("error "); });
        }
    };
    return ProductPickerComponent;
}());
__decorate([
    core_1.ViewChild(gift_baskets_component_1.GiftBasketComponent),
    __metadata("design:type", gift_baskets_component_1.GiftBasketComponent)
], ProductPickerComponent.prototype, "giftBasketComponent", void 0);
ProductPickerComponent = __decorate([
    core_1.Component({
        selector: 'products-picker',
        templateUrl: './products-picker.component.html',
        styleUrls: ['./products-picker.component.css'],
        encapsulation: core_1.ViewEncapsulation.None
    }),
    __metadata("design:paramtypes", [products_service_1.ProductsService, gift_basket_service_1.BasketService])
], ProductPickerComponent);
exports.ProductPickerComponent = ProductPickerComponent;
//# sourceMappingURL=products-picker.component.js.map