import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductsService} from './products.service';
import {Products} from '../model/products.model';
import 'rxjs/add/operator/map';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import {Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {

  public loading: boolean;
  public products: Products[]=[];

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
