import {BasketType} from './basket_type.model';
import {BasketItems} from './basket_items.model';

export class BasketExt{

    constructor(
        public basketId?: number,
        public basketName?: string,
        public basketType?: BasketType,
        public basketItems?: BasketItems[],
        public basketTotalPrice?:number,
        public season?: string,
        public basketImgContentType?: string,
        public basketImg?: any,
    ) {
    }
}
