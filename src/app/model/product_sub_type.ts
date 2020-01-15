import {ProductType} from "./product_type.model";

export class ProductSubType {
	constructor(
		public subTypeId?: number,
		public subTypeName?: string,
		public productType?: ProductType
	) {
	}
}
