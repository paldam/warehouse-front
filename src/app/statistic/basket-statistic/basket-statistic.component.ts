import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {BasketService} from "../../basket/basket.service";
import {CalendarSetingsComponent} from "../../primeNgCalendarSetings/calendarStings.component";

declare var $ :any;
@Component({
  selector: 'app-basket-statistic',
  templateUrl: './basket-statistic.component.html',
  styleUrls: ['./basket-statistic.component.css']
})
export class BasketStatisticComponent implements OnInit {

  public basketStatistic: any[] = [];
  value: Date;
  dateLang: any;
  public startDate:string = '2018-08-07';
  public endDate: string= '2018-08-07';
  public maxDate : Date;
  public loading: boolean= false;
  public formSubbmitted: boolean = false;
  public dateError: boolean = false;


  constructor(private basketService :BasketService,private calendarSetingsComponent: CalendarSetingsComponent) { }

  ngOnInit() {
    this.dateLang = this.calendarSetingsComponent.dateLang;

    let today = new Date();
    this.startDate = today.toISOString().substring(0,10);
    this.endDate = today.toISOString().substring(0,10);
    this.maxDate = today;
}



  submitOrderForm(form: NgForm) {

   this.formSubbmitted = true;

   if(this.startDate > this.endDate){
       this.dateError = true;
       this.basketStatistic = [];
   }else{
     this.dateError = false;
     this.basketService.getNumberOfBasketOrdered(this.startDate,this.endDate)
         .subscribe(data => {
           this.basketStatistic= data;
           console.log(this.startDate,this.endDate)

         })
   }


   }


}
