import {Product} from './product.model';

export class BasketItems{
    constructor(
        public product?: Product,
        public quantity?: number,
        public basketItemsId?: number,
        public basketId?: number,

    ){


}
}