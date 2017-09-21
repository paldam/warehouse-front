import {ProductType} from './product_type.model';

export class Product{
    constructor(
        public id?: number,
        public productName?: string,
        public productType?: ProductType,
        public capacity?: number,
        public price?: number,
        public stock?: number) {
    }
}
