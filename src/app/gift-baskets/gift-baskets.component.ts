import {Component, OnInit} from '@angular/core';
import {Basket} from '../model/basket.model';
import {BasketService} from './gift-basket.service';

@Component({
    selector: 'gift-baskets',
    templateUrl: './gift-baskets.component.html',
    styleUrls: ['./gift-baskets.component.css'],
})

export class GiftBasketComponent implements OnInit {

    private baskets: Basket[]=[];

    constructor(private basketService : BasketService) {
        basketService.getBaskets().subscribe(data=> this.baskets = data)
    }

    ngOnInit() {
    }
}