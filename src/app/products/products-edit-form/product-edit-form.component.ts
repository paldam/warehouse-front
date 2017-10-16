import {Component, OnInit} from '@angular/core';
import {Product} from '../../model/product.model';
import {NgForm} from '@angular/forms';
import {ProductsService} from '../products.service';
import {ProductType} from '../../model/product_type.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'product-edit-form',
    templateUrl: './product-edit-form.component.html',
    styleUrls: ['./product-edit-form.component.css']
})

export class ProductEditFormComponent implements OnInit {

    public product: Product = new Product();
    public productPrice : number ;
    public formSubmitted: boolean = false;

    constructor(private productsService: ProductsService, private router: Router, activeRoute: ActivatedRoute) {
        productsService.getProduct(activeRoute.snapshot.params["id"]).subscribe(data =>{
            this.product = data;
            this.productPrice = data.price/100;
        });
    }

    ngOnInit() {
    }



    submitForm(form: NgForm) {
        this.formSubmitted = true;

        if (form.valid) {
            this.product.price= this.productPrice*100;
            this.productsService.saveProduct(this.product).subscribe(
                order => {
                    this.product = new Product();
                    form.reset();
                    this.formSubmitted = false;
                    this.router.navigateByUrl('/product');
                },
                err =>  console.log("error" ));
        }
    }
}