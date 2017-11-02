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
var order_item_1 = require("../../model/order_item");
var gift_basket_service_1 = require("../gift-basket.service");
var customer_model_1 = require("../../model/customer.model");
var customer_service_1 = require("./customer.service");
var order_model_1 = require("../../model/order.model");
var order_service_1 = require("../../order/order.service");
var BasketOrderComponent = (function () {
    function BasketOrderComponent(basketService, customerService, orderService) {
        var _this = this;
        this.basketService = basketService;
        this.customerService = customerService;
        this.orderService = orderService;
        this.orderItems = [];
        this.baskets = [];
        this.customers = [];
        this.deliveryTypes = [];
        this.selectedCustomer = new customer_model_1.Customer();
        this.order = new order_model_1.Order();
        this.total = 0;
        this.formSubmitted = false;
        this.isReadOnlyProp = false;
        this.PopUpBackgroundStyle = {
            'dark_background': false,
        };
        basketService.getBaskets().subscribe(function (data) { return _this.baskets = data; });
        customerService.getCustomers().subscribe(function (data) { return _this.customers = data; });
        orderService.getDeliveryTypes().subscribe(function (data) { return _this.deliveryTypes = data; });
    }
    BasketOrderComponent.prototype.ngOnInit = function () {
    };
    BasketOrderComponent.prototype.addBasketToOrder = function (basket) {
        var line = this.orderItems.find(function (data) { return data.basket.basketId == basket.basketId; });
        if (line == undefined) {
            this.orderItems.push(new order_item_1.OrderItem(basket, 1));
        }
        else {
            line.quantity = line.quantity + 1;
        }
        this.recalculate();
    };
    BasketOrderComponent.prototype.updateQuantity = function (basketLine, quantity) {
        var line = this.orderItems.find(function (line) { return line.basket.basketId == basketLine.basket.basketId; });
        if (line != undefined) {
            line.quantity = Number(quantity);
        }
        this.recalculate();
    };
    BasketOrderComponent.prototype.isBasketLinesEmpty = function () {
        if (this.orderItems.length == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    BasketOrderComponent.prototype.deleteProductLine = function (id) {
        var index = this.orderItems.findIndex(function (data) { return data.basket.basketId == id; });
        if (index > -1) {
            this.orderItems.splice(index, 1);
        }
        this.recalculate();
    };
    BasketOrderComponent.prototype.recalculate = function () {
        var _this = this;
        this.total = 0;
        this.orderItems.forEach(function (orderItem) {
            orderItem.basket.basketItems.forEach(function (basketItem) {
                _this.total += basketItem.product.price * basketItem.quantity;
            });
        });
    };
    BasketOrderComponent.prototype.isFormReadOnly = function () {
        return this.isReadOnlyProp;
    };
    BasketOrderComponent.prototype.getCustomersList = function () {
        var _this = this;
        this.customerService.getCustomers().subscribe(function (data) { return _this.customers = data; });
    };
    BasketOrderComponent.prototype.pickCustomer = function (customer) {
        this.selectedCustomer = customer;
        this.isReadOnlyProp = true;
    };
    BasketOrderComponent.prototype.cleanForm = function (form, formAdidtional) {
        form.resetForm();
        formAdidtional.resetForm();
        this.order = new order_model_1.Order();
        this.selectedCustomer = new customer_model_1.Customer();
        this.isReadOnlyProp = false;
        this.formSubmitted = false;
    };
    BasketOrderComponent.prototype.submitOrderForm = function (form, formAdidtional) {
        var _this = this;
        this.formSubmitted = true;
        if (form.valid && formAdidtional.valid) {
            this.order.orderItems = this.orderItems;
            this.order.customer = this.selectedCustomer;

            this.orderService.saveOrder(this.order).subscribe(function (data) {
                _this.order = new order_model_1.Order();
                _this.selectedCustomer = new customer_model_1.Customer();
                _this.orderItems = [];
                _this.isReadOnlyProp = false;
                form.resetForm();
                formAdidtional.resetForm();
                _this.recalculate();
                _this.formSubmitted = false;
                //         this.giftBasketComponent.refreshData();
            }, function (err) { return console.log("error "); });
        }
    };
    BasketOrderComponent.prototype.setPopUpDarkBackgroudTrue = function () {
        this.PopUpBackgroundStyle = {
            'dark_background': true,
        };
    };
    BasketOrderComponent.prototype.setPopUpDarkBackgroudFalse = function () {
        this.PopUpBackgroundStyle = {
            'dark_background': false,
        };
    };
    return BasketOrderComponent;
}());
BasketOrderComponent = __decorate([
    core_1.Component({
        selector: 'basket-order',
        templateUrl: './basket-order.component.html',
        styleUrls: ['./basket-order.component.css'],
        encapsulation: core_1.ViewEncapsulation.None
    }),
    __metadata("design:paramtypes", [gift_basket_service_1.BasketService, customer_service_1.CustomerService, order_service_1.OrderService])
], BasketOrderComponent);
exports.BasketOrderComponent = BasketOrderComponent;
//# sourceMappingURL=basket-order.component.js.map