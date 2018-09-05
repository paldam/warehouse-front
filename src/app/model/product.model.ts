import {ProductType} from './product_type.model';
import {Supplier} from "./supplier.model";

export class Product{
    constructor(
        public id?: number,
        public productName?: string,
        public deliver?: string,
        public capacity?: number,
        public price?: number,
        public stock?: number,
        public tmpStock?: number,
        public isArchival?: number,
        public supplier?: Supplier,
        public lastStockEditDate? :Date
    ) {
    }
}
