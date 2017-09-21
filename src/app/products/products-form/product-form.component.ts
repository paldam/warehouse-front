import {Component, OnInit} from '@angular/core';
import {Products} from '../../model/products.model';
import {FormsModule, NgForm} from '@angular/forms';
import {ProductsService} from '../products.service';
import {Http,Response,Headers} from "@angular/http";
import * as http from 'selenium-webdriver/http';
import {Observable} from 'rxjs/Observable';
import {ProductType} from '../../model/product_type.model';
import {Router} from '@angular/router';

@Component({
    selector: 'product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})

export class ProductFormComponent implements OnInit {

    product: Products = new Products();
    productsTypes: ProductType[];
    formSubmitted: boolean = false;

    constructor(private productsService: ProductsService, private router: Router) {
        productsService.getProductsTypes().subscribe(data => this.productsTypes = data)
    }

    ngOnInit() {
    }



    submitForm(form: NgForm) {
        this.formSubmitted = true;

        if (form.valid) {
            this.productsService.saveProduct(this.product).subscribe(
                order => {
                    this.product = new Products();
                    form.reset();
                    this.formSubmitted = false;
                    this.router.navigateByUrl('/product');
                    },
                err =>  console.log("error" ));
        }
    }
}