import {ProductType} from './product_type.model';
import {Supplier} from "./supplier.model";
import {ProductSubType} from "./product_sub_type";

export class Product {
	constructor(
		public id?: number,
		public productName?: string,
		public deliver?: string,
		public capacity?: number,
		public price?: number,
		public stock?: number,
		public tmpStock?: number,
		public tmpOrdered?: number,
		public isArchival?: number,
		public suppliers?: Supplier[],
		public productType?: ProductType,
		public productSubType?: ProductSubType,
		public lastStockEditDate?: Date
	) {
	}
}
