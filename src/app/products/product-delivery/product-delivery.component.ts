import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductsService} from "../products.service";
import {Supplier} from "../../model/supplier.model";
import {Product} from "../../model/product.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";

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


  constructor(private productsService: ProductsService, private  messageServiceExt: MessageServiceExt) {
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

  addToStock(id: number, add: number){


    this.productsService.changeStock(id,add).subscribe(data=>{

       this.refreshData();

    })

  }

  getRowStyle(rowData: any, rowIndex: number): string{


    let timeNow = new Date().getTime();

    if( (timeNow - rowData.lastStockEditDate) /1000/60 < 60){    // 1h
      return 'ddd'
    }else{
      return ''
    }
  }

}
