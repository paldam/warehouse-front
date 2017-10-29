export class Customer{

    constructor(
        public customerId?: number,
        public organizationName?: string,
        public name?: string,
        public address?: string,
        public zipCode?: string,
        public cityName?: string,
        public phoneNumber?: string,
        public email?: string
    ) {
    }
}
