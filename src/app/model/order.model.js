"use strict";
var Order = (function () {
    function Order(orderId, 
        //public user?: User,
        customer, orderItems, orderDate, deliveryType, additionalInofrmation, deliveryDate) {
        this.orderId = orderId;
        this.customer = customer;
        this.orderItems = orderItems;
        this.orderDate = orderDate;
        this.deliveryType = deliveryType;
        this.additionalInofrmation = additionalInofrmation;
        this.deliveryDate = deliveryDate;
    }
    return Order;
}());
exports.Order = Order;
//# sourceMappingURL=order.model.js.map