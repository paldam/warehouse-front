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
var gift_basket_service_1 = require("./gift-basket.service");
var router_1 = require("@angular/router");
var GiftBasketComponent = (function () {
    function GiftBasketComponent(basketService, router) {
        var _this = this;
        this.basketService = basketService;
        this.router = router;
        this.baskets = [];
        this.url = '';
        basketService.getBaskets().subscribe(function (data) { return _this.baskets = data; });
        this.url = router.url;
    }
    GiftBasketComponent.prototype.ngOnInit = function () {
    };
    GiftBasketComponent.prototype.refreshData = function () {
        var _this = this;
        this.loading = true;
        setTimeout(function () {
            _this.basketService.getBaskets().subscribe(function (data) { return _this.baskets = data; });
            _this.loading = false;
        }, 1000);
    };
    return GiftBasketComponent;
}());
GiftBasketComponent = __decorate([
    core_1.Component({
        selector: 'gift-baskets',
        templateUrl: './gift-baskets.component.html',
        styleUrls: ['./gift-baskets.component.css'],
    }),
    __metadata("design:paramtypes", [gift_basket_service_1.BasketService, router_1.Router])
], GiftBasketComponent);
exports.GiftBasketComponent = GiftBasketComponent;
//# sourceMappingURL=gift-baskets.component.js.map