import {Customer} from './customer.model';
import {OrderItem} from './order_item';
import {DeliveryType} from './delivery_type.model';
export class Order{
    constructor(
        public orderId?: number,
        //public user?: User,
        public customer?: Customer,
        public orderItems?: OrderItem[],
        public orderDate?: Date,
        public deliveryType?: DeliveryType,
        public additionalInformation?: string,
        public deliveryDate?: Date,
    ){

    }
}

