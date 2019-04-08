import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BasketService} from "../basket.service";
import {Router} from "@angular/router";
import {Basket} from "../../model/basket.model";
import {ConfirmationService} from "primeng/primeng";
import {BasketType} from "../../model/basket_type.model";
import {AuthenticationService} from "../../authentication.service";
import {AppConstans} from "../../constans";

@Component({
  selector: 'app-basket',
  templateUrl: './basket-view.component.html',
  styleUrls: ['./basket-view.component.css']
})
export class BasketComponent implements OnInit {

  public baskets: Basket[] = [];
  public loading: boolean;
  public gb: any;
  public url: string ='';
  @ViewChild('onlyDeleted') el:ElementRef;
    public paginatorValues = AppConstans.PAGINATOR_VALUES;

  constructor(private basketService: BasketService, public router :Router, private confirmationService: ConfirmationService, private authenticationService :AuthenticationService) {
    basketService.getBaskets().subscribe(data => this.baskets = data);
    this.url = router.url;
  }

  ngOnInit() {
  }

    refreshData() {
      this.loading = true;
      setTimeout(() => {
          this.clickOnlyDeletedBasketChceckBox();
      this.loading = false;
  }, 1000);
}

  ShowConfirmModal(basket : Basket) {

    if(basket.basketType.basketTypeId == 99) {
      this.confirmationService.confirm({
        message: 'Jesteś pewny że chcesz trwale usunąć kosz ? ',
        accept: () => {
          let tmpBaskettype : BasketType= new BasketType(999);
          basket.basketType=tmpBaskettype;
          this.basketService.saveBasket(basket).subscribe(data=>{
              this.refreshData();
          });

        },
        reject:()=>{

        }
      });

    }else{
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

  clickOnlyDeletedBasketChceckBox(){

    if (this.el.nativeElement.checked){
      this.basketService.getDeletedBaskets().subscribe(data => this.baskets = data);
    }else{
      this.basketService.getBaskets().subscribe(data => this.baskets = data);
    }



  }

}
