import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductsService} from './products.service';
import {Product} from '../model/product.model';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {

  public loading: boolean;
  public products: Product[]=[];

  constructor(private productsService : ProductsService, private router: Router) {
    productsService.getProducts().subscribe(data=> this.products = data)

    }

  ngOnInit() {

  }

  refreshData() {
    this.loading = true;
    setTimeout(() => {
      this.productsService.getProducts().subscribe(data => this.products = data);
      this.loading = false;
    }, 1000);
  }
    selectProduct( id : number){
      this.router.navigateByUrl('/products/${id}');
    }


}
