import {Component, OnInit} from '@angular/core';
import {Product} from '../../model/product.model';
import {FormsModule, NgForm} from '@angular/forms';
import {ProductsService} from '../products.service';

import {ProductType} from '../../model/product_type.model';
import {Router} from '@angular/router';

@Component({
    selector: 'product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})

export class ProductFormComponent implements OnInit {

    public product: Product = new Product();
    public productsTypes: ProductType[];
    public formSubmitted: boolean = false;

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
                    console.log(JSON.stringify(this.product));
                    this.product = new Product();
                    form.reset();
                    this.formSubmitted = false;
                    this.router.navigateByUrl('/product');
                    },
                err =>  console.log("error" ));
        }
    }
}