import { Component, OnInit } from '@angular/core';
import {BasketService} from "../gift-baskets/gift-basket.service";
import {Router} from "@angular/router";
import {Basket} from "../model/basket.model";
import {ConfirmationService} from "primeng/primeng";
import {BasketType} from "../model/basket_type.model";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  public baskets: Basket[] = [];
  public loading: boolean;
  public url: string ='';
  public gb: any;


  constructor(private basketService: BasketService, private router :Router, private confirmationService: ConfirmationService) {
    basketService.getBaskets().subscribe(data => this.baskets = data);
    this.url = router.url;
  }

  ngOnInit() {
  }

  refreshData() {
    this.loading = true;
    setTimeout(() => {
      this.basketService.getBaskets().subscribe(data => this.baskets = data);
      this.loading = false;
    }, 1000);
  }

  ShowConfirmModal(basket : Basket) {
    this.confirmationService.confirm({
      message: 'Jesteś pewny że chcesz przenieś kosz  ' + basket.basketName + ' do archiwum ?',
      accept: () => {
        let tmpBaskettype : BasketType= new BasketType(99);
        basket.basketType=tmpBaskettype;
        this.basketService.saveBasket(basket).subscribe(data=>{
          this.refreshData();
        });

      },
      reject:()=>{

      }
    });
  }

}
