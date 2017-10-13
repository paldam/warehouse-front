"use strict";
var Basket = (function () {
    function Basket(basketId, basketName, basketType, basketItems, basketTotalPrice) {
        this.basketId = basketId;
        this.basketName = basketName;
        this.basketType = basketType;
        this.basketItems = basketItems;
        this.basketTotalPrice = basketTotalPrice;
    }
    return Basket;
}());
exports.Basket = Basket;
//# sourceMappingURL=basket.model.js.map