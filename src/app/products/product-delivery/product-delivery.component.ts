import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProductsService} from "../products.service";
import {Supplier} from "../../model/supplier.model";
import {Product} from "../../model/product.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {Router} from "@angular/router";
import {DataTable} from "primeng/primeng";

@Component({
  selector: 'app-product-delivery',
  templateUrl: './product-delivery.component.html',
  styleUrls: ['./product-delivery.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDeliveryComponent implements OnInit {


  public selectedSupplier : Supplier = new Supplier();
  public productSuppliers: Supplier[]=[];
  public dd: any[]=[];
  public productsBySupplier: any[]=[] ;
  public loading: boolean;
  public stock: number;
  public selectedSupplierId: number;
  public gb: any;
  public legend: string;
  public currentPageMode: number;
    public findInputtextOrder : any ;
    @ViewChild('globalfilter') el: ElementRef;



    constructor(private productsService: ProductsService, private  messageServiceExt: MessageServiceExt, public router :Router) {

    if (router.url == '/products/delivery') {
      this.legend = "Dostawa produktów";
      this.currentPageMode=1;  //
      console.log("dostawa ");
    }if (router.url == '/products/setdelivery'){
      this.legend = "Zamówienie produktów";
          console.log("zamówienie ");
          this.currentPageMode=2;

      }
      console.log(this.router.url);
    productsService.getSuppliers().subscribe(data=> this.productSuppliers = data);
  }

  ngOnInit() {
  }

  selectSupplier(id: number){

    this.selectedSupplierId = id;

      this.productsService.getProductsBySupplier(id).subscribe((data : any)=>{

          data.forEach(function(obj) { obj.add = 0; });

        this.productsBySupplier = data;

      } )



  }
  
  updateStockRow(event: any){
    this.productsService.saveProduct(event.data).subscribe(data =>{

      this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji stanu produktu',1000);


    }, error => {

      this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);



    });

  }

  refreshData(){


    this.productsService.getProductsBySupplier( this.selectedSupplierId).subscribe((data : any)=>{

      data.forEach(function(obj) { obj.add = 0; });

      this.productsBySupplier = data;
    } )
  }


  addToStockOrToOrder(id: number, add: number){


      if (this.currentPageMode==1) {

          this.productsService.changeStockEndResetOfProductsToDelivery(id,add).subscribe(data=>{
              this.refreshData();
              //this.findInputtextOrder ='';

          });



      }if (this.currentPageMode==2){

          this.productsService.addNumberOfProductsDelivery(id,add).subscribe(data=>{

              this.refreshData();
              //this.findInputtextOrder ='';

          })

      }



  }

  getRowStyle(rowData: any, rowIndex: number): string{


    let timeNow = new Date().getTime();

    if( (timeNow - rowData.lastStockEditDate) /1000/60 < 60){    // 1h
      return 'ddd'
    }else{
      return ''
    }
  }


    getRowStyle2(rowData: any, rowIndex: number): string{


        let timeNow = new Date().getTime();

        if( (timeNow - rowData.lastNumberOfOrderedEditDate) /1000/60 < 60){    // 1h
            return 'ddd'
        }else{
            return ''
        }
    }

}
