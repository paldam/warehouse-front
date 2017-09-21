import {Component, OnInit} from '@angular/core';
import {Product} from '../model/product.model';

@Component({
    selector: 'gift-baskets',
    templateUrl: './gift-baskets.component.html',
    styleUrls: ['./gift-baskets.component.css'],
})

export class GiftBasketComponent implements OnInit {

    public products: Product[]=[];

    constructor(){
    }

    ngOnInit() {
    }
}