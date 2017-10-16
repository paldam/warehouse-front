import {Customer} from './customer.model';
import {OrderItem} from './order_item';
import {DeliveryType} from './delivery_type.model';
export class OrderStatus{
    constructor(
        public orderStatusId?: number,
        public orderStatusName?: string

    ){

    }
}