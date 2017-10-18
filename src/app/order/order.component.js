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
var order_service_1 = require("./order.service");
var OrderComponent = (function () {
    function OrderComponent(orderService) {
        var _this = this;
        this.orderService = orderService;
        this.loading = false;
        this.orders = [];
        orderService.getOrders().subscribe(function (data) { return _this.orders = data; });
    }
    OrderComponent.prototype.refreshData = function () {
        var _this = this;
        this.loading = true;
        setTimeout(function () {
            _this.orderService.getOrders().subscribe(function (data) { return _this.orders = data; });
            _this.loading = false;
        }, 1000);
    };
    OrderComponent.prototype.ngOnInit = function () {
    };
    return OrderComponent;
}());
OrderComponent = __decorate([
    core_1.Component({
        selector: 'order',
        templateUrl: './order.component.html',
        styleUrls: ['./order.component.css'],
        encapsulation: core_1.ViewEncapsulation.None
    }),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderComponent);
exports.OrderComponent = OrderComponent;
//# sourceMappingURL=order.component.js.map