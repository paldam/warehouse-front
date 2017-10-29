import {Customer} from './customer.model';
import {OrderItem} from './order_item';
import {DeliveryType} from './delivery_type.model';
import {OrderStatus} from "./OrderStatus";
export class Order{
    constructor(
        public orderId?: number,
        public orderFvNumber?: string,
        public userName?: string,
        public customer?: Customer,
        public orderItems?: OrderItem[],
        public orderDate?: Date,
        public deliveryType?: DeliveryType,
        public additionalInformation?: string,
        public deliveryDate?: Date,
        public orderStatus? : OrderStatus,
        public orderTotalAmount? : number,
        public cod? : number,
    ){

    }
}

