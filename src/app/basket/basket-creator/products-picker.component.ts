import {Component,OnInit, ViewEncapsulation,ViewChild} from '@angular/core';
import {ProductsService} from '../../products/products.service';
import {Product} from '../../model/product.model';
import {BasketItems} from '../../model/basket_items.model';
import {Basket} from '../../model/basket.model';
import {BasketType} from '../../model/basket_type.model';
import {BasketService} from '../gift-basket.service';
import {NgForm} from '@angular/forms';
import {GiftBasketComponent} from '../basket-helper-list/gift-baskets.component';


@Component({
    selector: 'products-picker',
    templateUrl: './products-picker.component.html',
    styleUrls: ['./products-picker.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProductPickerComponent  {


    public products: Product[]=[];
    public productTmp: Product[]=[];
    public basketItems: BasketItems[]=[];
    public basketTypes: BasketType[]=[];
    public basket: Basket= new Basket();
    public basketsToSchema: Basket[]=[];
    public total: number=0;
    public formSubmitted: boolean = false;
    public loading: boolean;
    public basketPatterPickDialogShow: boolean = false;
    @ViewChild(GiftBasketComponent) giftBasketComponent : GiftBasketComponent;

    constructor(private productsService : ProductsService, private basketService :BasketService) {
        productsService.getProducts().subscribe(data=> this.products = data);
        basketService.getBasketsTypes().subscribe(data=>this.basketTypes = data);
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

    filtrOnlyAvaileble(event) {
        var isChecked = event.target.checked;

        if (isChecked) {
            if(this.productTmp.length == 0 ){
                this.productTmp = this.products;
            }
            this.products = this.products.filter(data => data.stock > 0);
        }else{
            this.products = this.productTmp;
        }
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



    submitForm(form: NgForm) {
        this.formSubmitted = true;

        if (form.valid && this.basketItems.length>0) {
            this.basket.basketItems= this.basketItems;
            this.basket.basketTotalPrice*=100;
            this.basketService.saveBasket(this.basket).subscribe(data=>{
                   this.basket=new Basket();
                   this.basketItems=[];
                   form.resetForm();
                    this.formSubmitted = false;
                   this.recalculate();
                   this.giftBasketComponent.refreshData();
            },
                err =>  console.log("error " ));
        }

    }
    pickBasket(basket : Basket) {
        basket.basketItems.map(data=> data.basketItemsId = null)
        this.basketItems = basket.basketItems;
        this.basketPatterPickDialogShow= false;
    }


    showBasketPatterList() {
        this.basketPatterPickDialogShow = true;
        this.basketService.getBaskets().subscribe(data=> this.basketsToSchema = data);
    }




}