import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Order} from "../model/order.model";
import {Checkbox} from "primeng/primeng";
import {OrderService} from "../order/order.service";
import {File} from "../model/file";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-order-audit',
  templateUrl: './order-audit.component.html',
  styleUrls: ['./order-audit.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class OrderAuditComponent implements OnInit {

    public orderStateBeforeChange : Order = new Order();
    public orderStateAfterChange : Order = new Order();
    public revIdOfOrderStateAfterChange :number ;
    public isDataFetchCompleteForAfterOrderState: Promise<boolean> = Promise.resolve(false);
    public isDataFetchCompleteForBeforeOrderState: Promise<boolean> = Promise.resolve(false);
    public customerDesc : string="";

    public fileList: File[]=[];

    public additionalSaleCheckbox: boolean = false;
    public additionalSaleCheckboxForAfterOrderPanel: boolean = false;
  constructor(orderService: OrderService, activatedRoute :ActivatedRoute) {


      this.revIdOfOrderStateAfterChange  = +activatedRoute.snapshot.paramMap.get('revId');// "+" parse to number



      orderService.getOrderPrevStateFromHistoryByRevId(this.revIdOfOrderStateAfterChange).subscribe(
          data => {
              this.orderStateBeforeChange = data[0];
              this.customerDesc = data[0].customer.name +" | "+ data[0].customer.company.companyName;
          },
          null,
          () => {
              this.isDataFetchCompleteForBeforeOrderState = Promise.resolve(true) ;
              this.orderStateBeforeChange.orderTotalAmount /=100 ;
              this.orderStateBeforeChange.cod /=100;


              setTimeout(() => {

                  this.additionalSaleCheckbox = this.orderStateBeforeChange.additionalSale == 1;
              },500 );
          });

      orderService.getOrderStateFromHistoryByRevId(this.revIdOfOrderStateAfterChange).subscribe(
          data => {
              this.orderStateAfterChange = data[0];
          },
          null,
          () => {
              this.isDataFetchCompleteForAfterOrderState = Promise.resolve(true) ;
              this.orderStateAfterChange.orderTotalAmount /=100 ;
              this.orderStateBeforeChange.cod /=100;

              setTimeout(() => {
                  this.additionalSaleCheckboxForAfterOrderPanel = this.orderStateAfterChange.additionalSale == 1;
              },500 );
          });





      


  }

  ngOnInit() {



  }

}
