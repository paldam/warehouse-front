import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";
import {AuthenticationService} from "../../authentication.service";
import * as XLSX from 'xlsx';
import {OrderService} from "../../order/order.service";
import {DataTable} from "primeng/primeng";

@Component({
  selector: 'app-products-stat',
  templateUrl: './products-stat.component.html',
  styleUrls: ['./products-stat.component.css']
})
export class ProductsStatComponent implements OnInit {

  public orders: any[]=[];
  public findInputtextOrder : any ;
  @ViewChild('dataTable') el:DataTable;

    constructor(private orderService: OrderService) {

        orderService.getOrdersDto().subscribe(data => {this.orders = data});
    }
  ngOnInit() {
  }


  click(){
      console.log(this.el);
  }


    gen(){
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.orders);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

        let today = new Date();
        let date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
        //let time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
        let fileName = "Zestawienie_" + date + ".xls" ;

        XLSX.writeFile(workbook, fileName, { bookType: 'xls', type: 'buffer' });
    }

}
