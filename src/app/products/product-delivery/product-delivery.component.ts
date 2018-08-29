import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../products.service";
import {Supplier} from "../../model/supplier.model";
import {Product} from "../../model/product.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";

@Component({
  selector: 'app-product-delivery',
  templateUrl: './product-delivery.component.html',
  styleUrls: ['./product-delivery.component.css']
})
export class ProductDeliveryComponent implements OnInit {


  public selectedSupplier : Supplier = new Supplier();
  public productSuppliers: Supplier[]=[];
  public productsBySupplier: Product[]=[] ;
  public loading: boolean;
  public gb: any;


  constructor(private productsService: ProductsService, private  messageServiceExt: MessageServiceExt) {
    productsService.getSuppliers().subscribe(data=> this.productSuppliers = data);
  }

  ngOnInit() {
  }

  selectSupplier(id: number){

    this.productsService.getProductsBySupplier(id).subscribe(data=> this.productsBySupplier = data)
    

  }
  
  updateStockRow(event: any){
    this.productsService.saveProduct(event.data).subscribe(data =>{

      this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji stanu produktu',1000);


    }, error => {

      this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);



    });

  }

}
