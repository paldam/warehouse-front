import { Component, OnInit } from '@angular/core';
import {ProductsService} from './products.service';
import {Products} from '../model/products.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public products: Products[]=[];

  constructor(private productsService : ProductsService) {
    productsService.getProducts().subscribe(data=> this.products = data)

    }


  ngOnInit() {
  }

}
