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


  constructor(private orderService : OrderService,activeRoute: ActivatedRoute, private  router: Router) {
     orderService.getOrder(activeRoute.snapshot.params["id"]).subscribe(res =>{
                  this.order = res;
                  this.customer =  res.customer;
                  this.orderItems = res.orderItems;
                  this.totalAmount = res.orderTotalAmount/100;

         })
      this.orderService.getDeliveryTypes().subscribe(data=> this.deliveryTypes = data);
      this.orderService.getOrderStatus().subscribe(data=> this.orderStatus=data);
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
    this.orderService.saveOrder(this.order).subscribe(data=>{
          this.router.navigateByUrl('/orders');

    },error2 => {
      console.log("error");
    })
  }



}
