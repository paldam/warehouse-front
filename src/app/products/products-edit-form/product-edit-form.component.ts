import {Component, OnInit} from '@angular/core';
import {Product} from '../../model/product.model';
import {NgForm} from '@angular/forms';
import {ProductsService} from '../products.service';
import {ProductType} from '../../model/product_type.model';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {Supplier} from "../../model/supplier.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";

@Component({
    selector: 'product-edit-form',
    templateUrl: 'product-edit-form.component.html',
    styleUrls: ['product-edit-form.component.css']
})

export class ProductEditFormComponent implements OnInit {

    public product: Product = new Product();
    public productPrice : number ;
    public formSubmitted: boolean = false;
    public productSuppliers: Supplier[]=[];

    constructor(private productsService: ProductsService, private router: Router, activeRoute: ActivatedRoute,private messageServiceExt: MessageServiceExt) {
        productsService.getProduct(activeRoute.snapshot.params["id"]).subscribe(data =>{
            this.product = data;
            this.productPrice = data.price/100;
        });

        productsService.getSuppliers().subscribe(data=> this.productSuppliers=data)
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


                    this.messageServiceExt.addMessage('success', 'Status', 'Dokonano edycji produktu');
                    this.router.navigate(["/product"]);
                }, error => {

                    this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);

                });
        }
    }

    compareSupplier( optionOne : Supplier, optionTwo : Supplier) : boolean {
        return optionTwo && optionTwo ? optionOne.supplierName === optionTwo.supplierName :optionOne === optionTwo;
    }
}