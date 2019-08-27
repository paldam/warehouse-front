import {Component, OnInit} from '@angular/core';
import {Product} from '../../model/product.model';
import {FormsModule, NgForm} from '@angular/forms';
import {ProductsService} from '../products.service';

import {ProductType} from '../../model/product_type.model';
import {Router} from '@angular/router';
import {Supplier} from "../../model/supplier.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {ProductSubType} from "../../model/product_sub_type";
import {SelectItem} from "primeng/api";

@Component({
    selector: 'product-form',
    templateUrl: 'product-form.component.html',
    styleUrls: ['product-form.component.css']
})

export class ProductFormComponent implements OnInit {

    public product: Product = new Product();
    public productSuppliers: Supplier[]=[];
    public productSubTypes: ProductSubType[]=[];
	public productSubTypesSelectItems: SelectItem[]=[];
    public productSupplierToAdd: Supplier = new Supplier();
    public formSubmitted: boolean = false;
    public formSupplierAddForm: boolean = false;
    public addSupplierWindow: boolean = false;
    public selectedSuppliersToAddEdit: Supplier[]=[];
	public supplierRequiredError : boolean = false;

    constructor(private productsService: ProductsService, private router: Router,private messageServiceExt: MessageServiceExt) {
        productsService.getSuppliers().subscribe(data=> this.productSuppliers=data);
		// productsService.getProductsTypes().subscribe(data=> this.productTypes=data)
        productsService.getProductsSubTypes().subscribe(data=> {
            this.productSubTypes=data;

            this.productSubTypes.forEach(value => {
                this.productSubTypesSelectItems.push({label: value.subTypeName + " (" + value.productType.typeName + ")", value: value} )
            })
		})



    }

    ngOnInit() {
        
        

    }



    submitForm(form: NgForm) {
        this.formSubmitted = true;
		this.checkSupplierValid();
        console.log(this.formSubmitted);
        console.log(form.valid);

        if (form.valid && this.selectedSuppliersToAddEdit.length > 0 && this.product.productSubType) {
            this.product.suppliers = this.selectedSuppliersToAddEdit;
            this.product.price *= 100;
            this.product.isArchival = 0;
            this.product.tmpStock = 0;
            console.log(this.product);

            if (this.product.stock == null) {
                this.product.stock = 0;
            }

            this.productsService.saveProduct(this.product).subscribe(
                order => {
                    this.product = new Product();
                    this.selectedSuppliersToAddEdit = [];
                    form.reset();
                    this.formSubmitted = false;
                    this.messageServiceExt.addMessage('success', 'Status', 'Poprawnie dodano produkt do bazy');
                    this.router.navigateByUrl('/product');
                }
                , error => {

                    this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);

                });
        }
    }

    submitSupplierAddForm(form2: NgForm){

    this.formSupplierAddForm= true;

        if (form2.valid) {

            this.productsService.saveSupplier(this.productSupplierToAdd).subscribe(data=>{

                this.productSupplierToAdd = new Supplier();
                this.formSupplierAddForm = false;
                this.messageServiceExt.addMessage('success', 'Status', 'Poprawnie dodano dostawcę');
                this.addSupplierWindow = false;
                this.productsService.getSuppliers().subscribe(data=> this.productSuppliers=data)


            }, error => {

                this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);

            });



        }

    }

    compareSupplier( optionOne : Supplier, optionTwo : Supplier) : boolean {
        return optionTwo && optionTwo ? optionOne.supplierName === optionTwo.supplierName :optionOne === optionTwo;
    }

    compareProductType( optionOne : ProductType, optionTwo : ProductType) : boolean {
        return optionTwo && optionTwo ? optionOne.typeName === optionTwo.typeName :optionOne === optionTwo;
    }


	compareProductSubType( optionOne : ProductSubType, optionTwo : ProductSubType) : boolean {
		return optionTwo && optionTwo ? optionOne.subTypeName === optionTwo.subTypeName :optionOne === optionTwo;
	}


    addSupplierWindowOn(){
        this.addSupplierWindow= true;
    }

	checkSupplierValid(){
		this.supplierRequiredError = this.selectedSuppliersToAddEdit.length == 0;
	}
}