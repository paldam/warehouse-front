"use strict";
var Customer = (function () {
    function Customer(customerId, organizationName, customerFirstName, customerLastName, address, zipCode, cityName, phoneNumber, email) {
        this.customerId = customerId;
        this.organizationName = organizationName;
        this.customerFirstName = customerFirstName;
        this.customerLastName = customerLastName;
        this.address = address;
        this.zipCode = zipCode;
        this.cityName = cityName;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
    return Customer;
}());
exports.Customer = Customer;
//# sourceMappingURL=customer.model.js.map