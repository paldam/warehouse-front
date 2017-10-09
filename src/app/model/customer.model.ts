export class Customer{

    constructor(
        public customerId?: number,
        public organizationName?: string,
        public customerFirstName?: string,
        public customerLastName?: string,
        public address?: string,
        public zipCode?: string,
        public cityName?: string,
        public phoneNumber?: number,
        public email?: string
    ) {
    }
}
