export class Address {

    constructor(
        public addressId?: number,
        public address?: string,
        public zipCode?: string,
        public cityName?: string,
        public isPrimaryAddress?: number,
        public contactPerson?: string,
        public phoneNumber ?: string,
        public additionalInformation?: string


    ) {

    }
}