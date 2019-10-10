import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../../model/order.model";

@Component({
  selector: 'app-order-preview',
  templateUrl: './order-preview.component.html',
  styleUrls: ['./order-preview.component.css']
})
export class OrderPreviewComponent implements OnInit {


 @Input() orderToShow :Order;
 public additionalSaleCheckbox: boolean = false;

  constructor() { }

  ngOnInit() {

      this.orderToShow.orderTotalAmount /= 100;

      setTimeout(() => {

          this.additionalSaleCheckbox = this.orderToShow.additionalSale == 1;
      },500 );
  }


  getCustomerDesc(): string{
      return this.orderToShow.customer.name + " | " + this.orderToShow.customer.company.companyName;
  }


	getAddressDesc(): string{
		return this.orderToShow.address.contactPerson + "  " +this.orderToShow.address.address + "  " + this.orderToShow.address.zipCode + "  " + this.orderToShow.address.cityName ;
	}


}
