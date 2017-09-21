import {Component,OnInit, ViewEncapsulation} from '@angular/core';
import {ProductsService} from '../../products/products.service';
import {Products} from '../../model/products.model';
import {ProductLine} from '../../model/product_line.model';

@Component({
    selector: 'products-picker',
    templateUrl: './products-picker.component.html',
    styleUrls: ['./products-picker.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProductPickerComponent implements OnInit {
    public products: Products[]=[];
    public productLines: ProductLine[]=[];

    constructor(private productsService : ProductsService) {
        productsService.getProducts().subscribe(data=> this.products = data)

    }

    ngOnInit() {
    }

    addProductToGiftBasket(product: Products){
        let line = this.productLines.find(data => data.product.id == product.id );

        if (line == undefined) {
            this.productLines.push(new ProductLine(product,1))
        }else{
            line.quantity= line.quantity + 1;
        }
    }

}