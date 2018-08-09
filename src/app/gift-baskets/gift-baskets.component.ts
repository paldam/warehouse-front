import {Component, OnInit} from '@angular/core';
import {Basket} from '../model/basket.model';
import {BasketService} from './gift-basket.service';
import {Router} from '@angular/router';


@Component({
    selector: 'gift-baskets',
    templateUrl: 'gift-baskets.component.html',
    styleUrls: ['gift-baskets.component.css'],
})

export class GiftBasketComponent implements OnInit {

    public baskets: Basket[] = [];
    public loading: boolean;
    public url: string ='';
    public gb: any;

    constructor(private basketService: BasketService, private router :Router) {
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

}