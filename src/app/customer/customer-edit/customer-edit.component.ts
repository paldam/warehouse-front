import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import {CustomerService} from "../customer.service";
import {Customer} from "../../model/customer.model";

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit {

  public customer : Customer = new Customer();

  constructor(private router: Router,private customerService :CustomerService, activeRoute: ActivatedRoute) {
    customerService.getCustomer(activeRoute.snapshot.params["id"]).subscribe(data=>{
           this.customer = data;

      console.log(router.url);

    })

  }

  ngOnInit() {
  }

}
