import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-order-preview',
  templateUrl: './order-preview.component.html',
  styleUrls: ['./order-preview.component.css']
})
export class OrderPreviewComponent implements OnInit {


 @Input() orderToShow :any;
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


}
