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
var products_service_1 = require("./products.service");
require("rxjs/add/operator/map");
var router_1 = require("@angular/router");
var ProductsComponent = (function () {
    function ProductsComponent(productsService, router) {
        var _this = this;
        this.productsService = productsService;
        this.router = router;
        this.products = [];
        productsService.getProducts().subscribe(function (data) { return _this.products = data; });
    }
    ProductsComponent.prototype.ngOnInit = function () {
    };
    ProductsComponent.prototype.refreshData = function () {
        var _this = this;
        this.loading = true;
        setTimeout(function () {
            _this.productsService.getProducts().subscribe(function (data) { return _this.products = data; });
            _this.loading = false;
        }, 1000);
    };
    ProductsComponent.prototype.selectProduct = function (id) {
        this.router.navigateByUrl('/products/${id}');
    };
    return ProductsComponent;
}());
ProductsComponent = __decorate([
    core_1.Component({
        selector: 'app-products',
        templateUrl: './products.component.html',
        styleUrls: ['./products.component.css'],
        encapsulation: core_1.ViewEncapsulation.None
    }),
    __metadata("design:paramtypes", [products_service_1.ProductsService, router_1.Router])
], ProductsComponent);
exports.ProductsComponent = ProductsComponent;
//# sourceMappingURL=products.component.js.map