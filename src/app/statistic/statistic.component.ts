import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../products/products.service";
import {CalendarSetingsComponent} from "../primeNgCalendarSetings/calendarStings.component";
import {NgForm} from "@angular/forms";
declare var $ :any;

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  public productsToOrder: any[] = [];
  value: Date;
  dateLang: any;
  public formSubmitted: boolean = false;
  public startDate: Date;
  public endDate: Date;
  public loading: boolean= false;

  constructor(private productSerive: ProductsService, private calendarSetingsComponent: CalendarSetingsComponent) {

    }


  ngOnInit() {
    this.dateLang = this.calendarSetingsComponent.dateLang;

    let today = new Date();
    this.startDate = today;
    this.endDate = today;
  }

  ngAfterViewInit(): void {
    $(document).ready(function () {
      $(function () {
        $("#datepicker").datepicker({
          dateFormat: "dd.mm.yy"
        });
      });
    })
  }

  submitOrderForm(form: NgForm) {
    this.formSubmitted = true;

    this.productSerive.getProductsToOrder(this.startDate.toISOString().substring(0, 10),this.endDate.toISOString().substring(0, 10))
        .subscribe(data => {
          this.productsToOrder = data;
        })
}
}
