import {PrizeOrderItems} from './prize-order-items';
import {User} from "./user.model";
import {PrizeOrderStatus} from "./prize-order-status";

export class PrizeOrder {
	constructor(
		public id?: number,
		public orderDate?: Date,
		public prizeOrderItems?: PrizeOrderItems[],
		public additionalInformation?: string,
		public orderTotalAmount?: number,
		public nameLastname?: string,
		public address?: string,
		public zipCode?: string,
		public city?: string,
		public phone?: string,
		public email?: string,
		public user?: User,
		public prizeOrderStatus?: PrizeOrderStatus
	) {
	}
}

