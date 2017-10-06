import {Customer} from './customer.model';
import {OrderItem} from './order_item';
export class Order{
    constructor(
        public orderId?: number,
        //public user?: User,
        public customer?: Customer,
        public orderItems?: OrderItem[],
        public orderDate?: Date
    ){

    }
}

