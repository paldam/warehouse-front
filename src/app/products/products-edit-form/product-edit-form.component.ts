import {Component, OnInit} from '@angular/core';
import {Products} from '../../model/products.model';
import {FormsModule, NgForm} from '@angular/forms';
import {ProductsService} from '../products.service';
import {ProductType} from '../../model/product_type.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'product-edit-form',
    templateUrl: './product-edit-form.component.html',
    //styleUrls: ['./product-edit-form.component.css']
})

export class ProductEditFormComponent implements OnInit {

    product: Products = new Products();
    productsTypes: ProductType[];
    formSubmitted: boolean = false;

    constructor(private productsService: ProductsService, private router: Router, activeRoute: ActivatedRoute) {
        productsService.getProduct(activeRoute.snapshot.params["id"]).subscribe(data => this.product = data);
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