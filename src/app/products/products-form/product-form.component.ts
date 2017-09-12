import {Component, OnInit} from '@angular/core';
import {Products} from '../../model/products.model';
import {FormsModule, NgForm} from '@angular/forms';

@Component({
    selector: 'product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})

export class ProductFormComponent implements OnInit {

    product: Products = new Products();
    formSubmitted : boolean = false;
    constructor() {
    }

    ngOnInit() {
    }



    get jsonProduct() {
        return JSON.stringify(this.product);
    }
    addProduct(p: Products) {
        console.log("New Product: " + this.jsonProduct);
    }

    submitForm(form: NgForm) {
        this.formSubmitted = true;

        if (form.valid) {
        this.addProduct(this.product);
        this.product = new Products();
        form.reset();
        this.formSubmitted=false;
        }
    }

}
