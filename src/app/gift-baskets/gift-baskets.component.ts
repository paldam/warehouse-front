import {Component, OnInit} from '@angular/core';
import {ProductsService} from '../products/products.service';
import {Router} from '@angular/router';
import {Products} from '../model/products.model';

@Component({
    selector: 'gift-baskets',
    templateUrl: './gift-baskets.component.html',
    styleUrls: ['./gift-baskets.component.css'],
})

export class GiftBasketComponent implements OnInit {

    public products: Products[]=[];

    constructor(){

    }

    ngOnInit() {
    }
}