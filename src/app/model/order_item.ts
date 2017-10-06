import {Basket} from './basket.model';
export class OrderItem{
    constructor(
        public basket?: Basket,
        public quantity?: number,
        public orderItemId?: number
    ){

    }
}
