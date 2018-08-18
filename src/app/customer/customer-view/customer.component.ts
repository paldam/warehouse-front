import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../customer.service";
import {Customer} from "../../model/customer.model";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  public loading: boolean= false;
  public customersList :Customer[]=[];

  constructor(private customerService :CustomerService) {

    customerService.getCustomers().subscribe(data=>{
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


}
