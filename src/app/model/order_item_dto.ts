
import {OrderItem} from "./order_item";
export class OrderItemDto{
    constructor(
        public orderItems?: OrderItem[],
        public orderId?: number,
    ){

    }
}
