import {Component, OnInit} from '@angular/core';
import {Product} from '../../model/product.model';
import {NgForm} from '@angular/forms';
import {ProductsService} from '../products.service';
import {ProductType} from '../../model/product_type.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Supplier} from "../../model/supplier.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {ProductSubType} from "../../model/product_sub_type";
import {SelectItem} from "primeng/api";

@Component({
	selector: 'product-edit-form',
	templateUrl: 'product-edit-form.component.html',
	styleUrls: ['product-edit-form.component.css']
})
export class ProductEditFormComponent
	implements OnInit {
	public product: Product = new Product();
	public productPrice: number;
	public formSubmitted: boolean = false;
	public productSuppliers: Supplier[] = [];
	public productSubTypes: ProductSubType[] = [];
	public productSubTypesSelectItems: SelectItem[] = [];
	public selectedSuppliersToAddEdit: Supplier[] = [];
	public supplierRequiredError: boolean = false;

	constructor(private productsService: ProductsService, private router: Router, activeRoute: ActivatedRoute,
				private messageServiceExt: MessageServiceExt) {
		productsService.getProduct(activeRoute.snapshot.params["id"]).subscribe(data => {
			this.product = data;
			this.productPrice = data.price / 100;
			this.selectedSuppliersToAddEdit = data.suppliers;
		});
		productsService.getSuppliers().subscribe(data => this.productSuppliers = data);
		productsService.getProductsSubTypes().subscribe(data => {
			this.productSubTypes = data;
			this.productSubTypes.forEach(value => {
				this.productSubTypesSelectItems.push({
					label: value.subTypeName + " (" + value.productType.typeName + ")",
					value: value
				})
			})
		})
	}

	ngOnInit() {
	}

	submitForm(form: NgForm) {
		this.formSubmitted = true;
		this.checkSupplierValid();
		if (form.valid && this.selectedSuppliersToAddEdit.length > 0 && this.product.productSubType) {
			this.product.suppliers = this.selectedSuppliersToAddEdit;
			if (!this.product.price) {
				this.product.price = 0;
			}
			this.product.price = Math.round(this.product.price * 100);
			this.productsService.saveProduct(this.product).subscribe(
				order => {
					this.product = new Product();
					this.selectedSuppliersToAddEdit = [];
					form.reset();
					this.formSubmitted = false;
					this.messageServiceExt.addMessage('success', 'Status', 'Dokonano edycji produktu');
					this.router.navigate(["/product"]);
				}, error => {
					this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);
				});
		}
	}

	compareSupplier(optionOne: Supplier, optionTwo: Supplier): boolean {
		return optionTwo && optionTwo ? optionOne.supplierName === optionTwo.supplierName : optionOne === optionTwo;
	}

	compareProductType(optionOne: ProductType, optionTwo: ProductType): boolean {
		return optionTwo && optionTwo ? optionOne.typeName === optionTwo.typeName : optionOne === optionTwo;
	}

	compareProductSubType(optionOne: ProductSubType, optionTwo: ProductSubType): boolean {
		return optionTwo && optionTwo ? optionOne.subTypeName === optionTwo.subTypeName : optionOne === optionTwo;
	}

	checkSupplierValid() {
		this.supplierRequiredError = this.selectedSuppliersToAddEdit.length == 0;
	}
}