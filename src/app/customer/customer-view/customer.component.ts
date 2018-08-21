import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../customer.service";
import {Customer} from "../../model/customer.model";
import {OrderService} from "../../order/order.service";
import {Order} from "../../model/order.model";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  public loading: boolean= false;
  public customersList :any[]=[];
  public allOrdersByCustomerList : Order[] = [];

  constructor(private customerService :CustomerService, private  orderService: OrderService) {

    customerService.getAllCustomerWithPrimaryAddress().subscribe(data=>{
      this.customersList = data;
    })

  }

  ngOnInit() {
  }


  refreshData(){
    this.loading = true;
    setTimeout(() => {
      this.customerService.getCustomers().subscribe(data=>{
        this.customersList = data;
        });
      this.loading = false;
    }, 1000);

  }


  getOrdersByCustomer(id :number){

    this.orderService.getOrderByCustomer(id).subscribe(data=>{

      this.allOrdersByCustomerList = data;

    })
  }


}
