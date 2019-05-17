import {Address} from "./address.model";
import {Company} from "./company.model";
export class Customer{

    constructor(
        public customerId?: number,
        public name?: string,
        public email?: string,
        public phoneNumber?: string,
        public additionalInformation?: string,
        public cimapny?: Company,
        public addresses?: Address[],
    ){

    }

}

