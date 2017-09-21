import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductLine} from '../../model/product_line.model';
import {FieldsetModule} from 'primeng/primeng';

@Component({
    selector: 'basket-summary',
    templateUrl: './basket-summary.component.html',
    styleUrls: ['./basket-summary.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BasketSummaryComponent implements OnInit {

    @Input() productLines: ProductLine[];
    public suma: number;
    constructor() {
    }

    ngOnInit() {
    }

    isProductLinesEmpty() : boolean{
        if (this.productLines.length == 0) {
            return true
        } else {
            return false
        }
    }
    deleteProductLine(id : number){

        let index = this.productLines.findIndex(data=> data.product.id == id);
        if (index > -1){
            this.productLines.splice(index,1);
        }
    }

    totalLines(): number{
        let suma = 0;
        for ( let i=0 ; i< this.productLines.length; i++ ){
            suma=suma+ (this.productLines[i].product.price * this.productLines[i].quantity);
        }
        this.suma=suma;
        return suma;
    }
}