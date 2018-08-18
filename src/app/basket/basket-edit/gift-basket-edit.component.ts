import { Component, OnInit } from '@angular/core';
import {BasketService} from "../gift-basket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Basket} from "../../model/basket.model";
import {BasketType} from "../../model/basket_type.model";
import {BasketOrderComponent} from "../../order/basket-order/basket-order.component";
import {ProductsService} from "../../products/products.service";
import {Product} from "../../model/product.model";
import {BasketItems} from "../../model/basket_items.model";
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-gift-basket-edit',
  templateUrl: './gift-basket-edit.component.html',
  styleUrls: ['./gift-basket-edit.component.css']
})
export class GiftBasketEditComponent implements OnInit {

  public basket: Basket = new Basket();
  public basketTypes: BasketType[]=[];
  public basketItems: BasketItems[]=[];
  public products: Product[]=[];
  public total: number=0;
  public formSubmitted: boolean = false;
  public loading: boolean;
  public productTmp: Product[]=[];


  constructor(private productsService: ProductsService,private basketService :BasketService, private router: Router, activeRoute: ActivatedRoute) {
        basketService.getBasket(activeRoute.snapshot.params["basketId"]).subscribe(data=>{
          this.basket = data;
          this.basketItems = data.basketItems;
          this.basket.basketTotalPrice/=100;
        })
        basketService.getBasketsTypes().subscribe(data=>{this.basketTypes= data;
        })
        productsService.getProducts().subscribe(data=> this.products = data);


  }

  ngOnInit() {
}
  ngAfterViewChecked(){
    this.recalculate();
  }
  compareBasketType( optionOne : BasketType, optionTwo : BasketType) : boolean {
    console.log(optionOne + '' + optionTwo);
    return optionTwo && optionTwo ? optionOne.basketTypeId === optionTwo.basketTypeId :optionOne === optionTwo;

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
            this.router.navigateByUrl('/baskets');

          },
          err =>  console.log("error " ));
    }

  }


}
