"use strict";
var Product = (function () {
    function Product(id, productName, productType, capacity, price, stock) {
        this.id = id;
        this.productName = productName;
        this.productType = productType;
        this.capacity = capacity;
        this.price = price;
        this.stock = stock;
    }
    return Product;
}());
exports.Product = Product;
//# sourceMappingURL=product.model.js.map