import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProductsService} from "../../products/products.service";
import {CalendarSetingsComponent} from "../../primeNgCalendarSetings/calendarStings.component";
import {NgForm} from "@angular/forms";
import {SelectItem} from "primeng/api";
import * as XLSX from "xlsx";
import {DataTable} from "primeng/primeng";
import {AppConstans} from "../../constans";
declare var $ :any;

@Component({
  selector: 'app-statistic2',
  templateUrl: './statistic2.component.html',
  styleUrls: ['./statistic2.component.css']
})
export class Statistic2Component implements OnInit {

  public productsToOrder: any[] = [];
  value: Date;
  dateLang: any;
  public formSubmitted: boolean = false;
  public startDate: string;
  public endDate: string;
  public loading: boolean= false;
  public suppliers: SelectItem[] = [];
  public dateError: boolean = false;
  @ViewChild('dt') el:DataTable;
    public paginatorValues = AppConstans.PAGINATOR_VALUES;
    @ViewChild('sortByOrderDate') sortByOrderDateCheckBox :ElementRef;


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
      }else {

          if (this.sortByOrderDateCheckBox.nativeElement.checked) {

                this.productSerive.getProductsToOrderWithoutDeletedByOrderDate(this.startDate, this.endDate )
                  .subscribe(data => {
                      this.productsToOrder = data;
                  })
          }else{


              this.productSerive.getProductsToOrderWithoutDeletedByDeliveryDate(this.startDate, this.endDate )
                  .subscribe(data => {
                      this.productsToOrder = data;
                  })

          }
      }





    }


    generateXls(){
          let filt: any[] =[];
      if (!this.el.filteredValue ){
        filt = this.el.value;
      }else{
        filt = this.el.filteredValue;
      }


        let dataToGenerateFile: any[]=[];


        for (let i = 0; i < filt.length;i++) {
            dataToGenerateFile[i] = {"Nazwa Produktu":filt[i].product_name, "Nazwa Dostawcy":filt[i].supplier.supplierName,"Ilość":filt[i].suma}
        }



        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToGenerateFile);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

        let today = new Date();
        let date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
        //let time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
        let fileName = "Zestawienie_" + date + ".xls" ;

        XLSX.writeFile(workbook, fileName, { bookType: 'xls', type: 'buffer' });
    }


}
