import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProductsService} from './products.service';
import {Product} from '../model/product.model';
import {ActivatedRoute, NavigationEnd, Router, RoutesRecognized} from '@angular/router';
import {ConfirmationService} from "primeng/primeng";
import {isUndefined} from "util";
import { filter } from 'rxjs/operators';
import {pairwise} from "rxjs/internal/operators";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {
  public loading: boolean;
  public products: Product[]=[];
  public lastVisitedPage: number ;
  public findInputtext: string = "";

  constructor(private productsService : ProductsService,activeRoute: ActivatedRoute,
              private router: Router,private confirmationService: ConfirmationService) {

    productsService.getProducts().subscribe(data=> this.products = data);


    this.router.events
        .pipe(filter((e: any) => e instanceof RoutesRecognized),
            pairwise()
        ).subscribe((e: any) => {
      let previousUrlTmp = e[0].urlAfterRedirects ;

      if (previousUrlTmp.search('/product')==-1) {
        console.log("nie")
        localStorage.removeItem('findInputtext');
      }else{
        console.log("tak")
      }

    });


    if (localStorage.getItem('findInputtext')){
      this.findInputtext = (localStorage.getItem('findInputtext'));
    }else{
      this.findInputtext = "";
    }

}



  ngOnInit() {


    if (localStorage.getItem('lastPage')){
      let tmplastVisitedPage =parseInt(localStorage.getItem('lastPage'));
      this.lastVisitedPage = (tmplastVisitedPage -1)*20;
    }else{
      this.lastVisitedPage = 0;
    }



  }

  refreshData() {
    this.loading = true;
    setTimeout(() => {
      this.productsService.getProducts().subscribe(data => this.products = data);
      this.loading = false;
    }, 1000);
  }


  goToEditPage(index,id) {

      let pageTmp = ((index-1) / 20)+1;
      localStorage.setItem('lastPage', pageTmp.toString());
      let textTmp = this.findInputtext;
      localStorage.setItem('findInputtext', textTmp);
      this.router.navigate(["/product/",id]);
  }

  selectProduct( id : number){
    this.router.navigateByUrl('/products/${id}');

  }

  ShowConfirmModal(product: Product) {
    this.confirmationService.confirm({
      message: 'Jesteś pewny że chcesz przenieś produkt  ' + product.productName + ' do archiwum ?',
      accept: () => {
          product.isArchival=1;
          this.productsService.saveProduct(product).subscribe(data=>{
            this.refreshData();

          });

      },
      reject:()=>{

      }
    });
  }



}
