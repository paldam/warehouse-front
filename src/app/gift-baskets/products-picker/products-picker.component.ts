import {Component,OnInit, ViewEncapsulation} from '@angular/core';
import {ProductsService} from '../../products/products.service';
import {Product} from '../../model/product.model';
import {BasketItems} from '../../model/basket_items.model';

@Component({
    selector: 'products-picker',
    templateUrl: './products-picker.component.html',
    styleUrls: ['./products-picker.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProductPickerComponent implements OnInit {
    public products: Product[]=[];
    public basketItems: BasketItems[]=[];
    public total: number=0;
    public markUp: number =10;

    constructor(private productsService : ProductsService) {
        productsService.getProducts().subscribe(data=> this.products = data)
    }

    ngOnInit() {
    }

    addProductToGiftBasket(product: Product){
        let line = this.basketItems.find(data => data.product.id == product.id );

        if (line == undefined) {
            this.basketItems.push(new BasketItems(product,1))
        }else{
            line.quantity= line.quantity + 1;
        }
        this.recalculate();
    }

    isProductLinesEmpty() : boolean{
        if (this.basketItems.length == 0) {
            return true
        } else {
            return false
        }
    }
    updateQuantity(productLine: BasketItems, quantity: number) {
        let line = this.basketItems.find(line => line.product.id == productLine.product.id);
        if (line != undefined) {
            line.quantity = Number(quantity);
        }
        this.recalculate();
    }

    deleteProductLine(id : number){

        let index = this.basketItems.findIndex(data=> data.product.id == id);
        if (index > -1){
            this.basketItems.splice(index,1);
        }
        this.recalculate();
    }


    recalculate(){
        this.total = 0;
        this.basketItems.forEach(data=> {
            this.total += data.product.price * data.quantity;
        })


    }

}