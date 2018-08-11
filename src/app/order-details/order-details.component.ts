import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../order/order.service";
import {Order} from "../model/order.model";
import {OrderItem} from "../model/order_item";
import {DeliveryType} from "../model/delivery_type.model";
import {Customer} from "../model/customer.model";
import {OrderStatus} from "../model/OrderStatus";
import {Product} from "../model/product.model";
import {ConfirmationService} from "primeng/primeng";
import {AuthenticationService} from "../authentication.service";
import {Basket} from "../model/basket.model";
import {BasketService} from "../gift-baskets/gift-basket.service";


@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailsComponent implements OnInit {

  public order : Order = new Order();
  public orderItems : OrderItem[]=[];
  public deliveryTypes: DeliveryType[]=[];
  public customer : Customer = new Customer() ;
  public isReadOnlyProp: boolean = true;
  public formSubmitted: boolean = false;
  public orderStatus: OrderStatus[]= [];
  public loading: boolean= false;
  public totalAmount: number;
  public orderStatusId: number;
    public baskets: Basket[]=[];
    public total: number = 0;


  constructor(private basketService : BasketService,private orderService : OrderService,activeRoute: ActivatedRoute, private  router: Router,public authenticationService: AuthenticationService) {
     orderService.getOrder(activeRoute.snapshot.params["id"]).subscribe(res =>{
                  this.order = res;
                  this.customer =  res.customer;
                  this.orderItems = res.orderItems;
                  this.totalAmount = res.orderTotalAmount/100;
                  this.order.cod /=100;
                  this.recalculate();

         })
      this.orderService.getDeliveryTypes().subscribe(data=> this.deliveryTypes = data);
      this.orderService.getOrderStatus().subscribe(data=> this.orderStatus=data);
      basketService.getBaskets().subscribe(data=> this.baskets = data);

  }


  ngOnInit() {
  }

  compareDeliveryType( optionOne : DeliveryType, optionTwo : DeliveryType) : boolean {
    return optionTwo && optionTwo ? optionOne.deliveryTypeId === optionTwo.deliveryTypeId :optionOne === optionTwo;
}
    compareOrderStatus( optionOne : OrderStatus, optionTwo : OrderStatus) : boolean {
        console.log(optionOne + '' + optionTwo);
        return optionTwo && optionTwo ? optionOne.orderStatusId === optionTwo.orderStatusId :optionOne === optionTwo;

    }
  isFormReadOnly() : boolean{
    return this.isReadOnlyProp;
  }


  editOrderForm() {
      if (this.order.deliveryType.deliveryTypeId == 5 || this.order.deliveryType.deliveryTypeId == 6 ||this.order.deliveryType.deliveryTypeId == 7 ){
          this.order.cod *=100;
      }else{
          this.order.cod =0;
      }
      this.order.customer = this.customer;
      this.order.orderTotalAmount = this.total;
      console.log(JSON.stringify(this.order));
    this.orderService.saveOrder(this.order).subscribe(data=>{
          this.router.navigateByUrl('/orders');

    },error2 => {
      console.log("error");
    })
  }

    addBasketToOrder(basket: Basket){
        let line = this.orderItems.find(data => data.basket.basketId == basket.basketId );

        if (line == undefined) {
            this.orderItems.push(new OrderItem(basket,1))
        }else{
            line.quantity= line.quantity + 1;
        }
        this.recalculate();
        // this.recalculateTotalPlusMarkUp();
    }
    updateQuantity(basketLine: OrderItem, quantity: number) {
        let line = this.orderItems.find(line => line.basket.basketId== basketLine.basket.basketId);
        if (line != undefined) {
            line.quantity = Number(quantity);
        }
        this.recalculate();
        // this.recalculateTotalPlusMarkUp();
    }

    isBasketLinesEmpty() : boolean{
        if (this.orderItems.length == 0) {
            return true
        } else {
            return false
        }
    }
    cancelEdit(){
        this.router.navigateByUrl('/orders');
    }

    deleteProductLine(id : number){

        let index = this.orderItems.findIndex(data=> data.basket.basketId == id);
        if (index > -1){
            this.orderItems.splice(index,1);
        }
        this.recalculate();
        // this.recalculateTotalPlusMarkUp();
    }

    recalculate(){
        this.total = 0;
        this.orderItems.forEach(orderItem=> {
            this.total += (orderItem.basket.basketTotalPrice * orderItem.quantity);
        })

    }



}
