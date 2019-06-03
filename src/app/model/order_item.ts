import {Basket} from './basket.model';

export class OrderItem {
	constructor(
		public basket?: Basket,
		public quantity?: number,
		public orderItemId?: number,
		public  stateOnProduction  ?: number,
		public  stateOnWarehouse ?: number,
		public  stateOnLogistics  ?: number
	) {
	}
}