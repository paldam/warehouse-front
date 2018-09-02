import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../products/products.service";
import {CalendarSetingsComponent} from "../../primeNgCalendarSetings/calendarStings.component";
import {NgForm} from "@angular/forms";
import {SelectItem} from "primeng/api";
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
  public startDate: string;
  public endDate: string;
  public loading: boolean= false;
  public suppliers: SelectItem[] = [];
  public dateError: boolean = false;


  constructor(private productSerive: ProductsService,private calendarSetingsComponent: CalendarSetingsComponent) {
    productSerive.getSuppliers().subscribe(data=> {

      this.suppliers.push({label: '-- Wszyscy Dostawcy --', value: null});
      data.forEach(data => {
        this.suppliers.push({label: data.supplierName, value: data.supplierName});
      })
    })
  }


  ngOnInit() {

    this.dateLang = this.calendarSetingsComponent.dateLang;

    let today = new Date();
    this.startDate = today.toISOString().substring(0,10);
    this.endDate = today.toISOString().substring(0,10);
  }


  submitOrderForm(form: NgForm) {

      this.formSubmitted = true;

      if(this.startDate > this.endDate) {
        this.dateError = true;
      }else{
        this.productSerive.getProductsToOrder(this.startDate,this.endDate)
            .subscribe(data => {
              this.productsToOrder = data;
            })
      }

    }


}
