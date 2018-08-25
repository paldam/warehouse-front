import {Address} from "./address.model";
export class Customer{

    constructor(
        public customerId?: number,
        public organizationName?: string,
        public name?: string,
        public addresses?: Address[],
        public email?: string,
        public phoneNumber?: string,
    ){

    }

}
