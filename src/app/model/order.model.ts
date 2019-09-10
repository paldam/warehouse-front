import {Customer} from './customer.model';
import {OrderItem} from './order_item';
import {DeliveryType} from './delivery_type.model';
import {OrderStatus} from "./OrderStatus";
import {Address} from "./address.model";
import {User} from "./user.model";
export class Order{
    constructor(
        public orderId?: number,
        public orderFvNumber?: string,
        public userName?: string,
        public customer?: Customer,
        public orderItems?: OrderItem[],
        public orderDate?: Date,
        public deliveryType?: DeliveryType,
        public weekOfYear? : number,
        public additionalInformation?: string,
		public textToCard?: string,
        public deliveryDate?: Date,
        public orderStatus? : OrderStatus,
        public orderTotalAmount? : number,
        public cod? : number,
        public address?: Address,
        public additionalSale?: number,
        public contactPerson?: string,
        public productionUser?: User,
		public loyaltyUser?: User,
		public allreadyComputedPoints? : boolean

    ){

    }
}

