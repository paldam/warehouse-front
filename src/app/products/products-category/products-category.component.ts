import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductsService} from "../products.service";
import {ProductType} from "../../model/product_type.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {Supplier} from "../../model/supplier.model";
import {ConfirmationService} from "primeng/api";
import {AuthenticationService} from "../../authentication.service";
import {CoreDataTableViewComponent} from "../../coreViewComponent";
import {ProductSubType} from "../../model/product_sub_type";
import {NgForm} from "@angular/forms";

@Component({
	selector: 'app-products-category',
	templateUrl: './products-category.component.html',
	styleUrls: ['./products-category.component.css']
})
export class ProductsCategoryComponent extends CoreDataTableViewComponent implements OnInit {
	public mainCategoriesList: ProductType[] = [];
	public subCategoriesList: ProductSubType[]=[];
	public tmpTypeName: string;
	public tmpSubTypeName: string;
	//TODO
	public formSubmitted: boolean = false;
	public formSubmitted2: boolean = false;
	public formSubmitted3: boolean = false;
	public addProductTypeDialogShow: boolean = false;
	public addProductSubTypeDialogShow: boolean = false;
	public editProductSubTypeDialogShow: boolean = false;
	public subCategory:  ProductSubType = new ProductSubType();
	public subCategoryToEdit : ProductSubType = new ProductSubType();
	@ViewChild('type_name') formTypeNameInputField: any;
	@ViewChild('sub_type_name') formSubTypeNameInputField: any;
	@ViewChild('hd') hd: any;
	constructor(private productsService: ProductsService, private messageServiceExt: MessageServiceExt, private confirmationService: ConfirmationService, private authenticationService: AuthenticationService) {
		super();
		productsService.getProductsTypes().subscribe(data => {
			this.mainCategoriesList = data;
		});

		this.productsService.getProductsSubTypes().subscribe(value => {
			this.subCategoriesList = value;
		});

	}

	ngOnInit() {
	}

	editMainCategory(category) {
		this.productsService.saveProductType(category).subscribe(
			value => {
				this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji nazwy', 5000);
				this.refreshData();
			},
			error => {
				this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ', 5000);
			}
		)
	}

	deleteCategory(category: ProductType) {
		this.confirmationService.confirm({
			key: "resetType",
			message: 'Jesteś pewny że chcesz usunąć ten typ produktu ?',
			accept: () => {
				this.productsService.deleteProductType(category.typeId).subscribe(
					data => {
						this.messageServiceExt.addMessageWithTime('success', 'Status', 'Usunięto kategorię', 5000);
						this.refreshData();
					},
					error => {
						this.messageServiceExt.addMessageWithTime('error', 'Błąd', 'Nie można usunać tej kategori ', 5000);
						this.refreshData()
					}
				)
			},
			reject: () => {
			}
		});
	}


	deleteSubCategory(category: ProductSubType) {
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz usunąć ten typ produktu ?',
			accept: () => {
				this.productsService.deleteSubProductType(category.subTypeId).subscribe(
					data => {
						this.messageServiceExt.addMessageWithTime('success', 'Status', 'Usunięto kategorię', 5000);
						this.refreshData();
					},
					error => {
						this.messageServiceExt.addMessageWithTime('error', 'Błąd', 'Nie można usunać tej kategori ', 5000);
						this.refreshData()
					}
				)
			},
			reject: () => {
			}
		});
	}

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.productsService.getProductsTypes().subscribe(data => this.mainCategoriesList = data);
			this.productsService.getProductsSubTypes().subscribe(value => this.subCategoriesList = value);
			this.loading = false;
		}, 1000);

	}

	addTypeShow(){
		this.addProductTypeDialogShow = true;

	}

	addSubTypeShow(){
		this.addProductSubTypeDialogShow = true;
	}



	closeSupplierAddDialog(){
		this.addProductTypeDialogShow = false;
	}

	closeSubAddDialog(){
		this.addProductSubTypeDialogShow = false;
	}
	closeSubEditDialog(){
		this.editProductSubTypeDialogShow = false;
	}

	compareProductSubType( optionOne : ProductSubType, optionTwo : ProductSubType) : boolean {
		return optionTwo && optionTwo ? optionOne.subTypeName === optionTwo.subTypeName :optionOne === optionTwo;
	}

	compareProductType( optionOne : ProductType, optionTwo : ProductType) : boolean {
		return optionTwo && optionTwo ? optionOne.typeName === optionTwo.typeName :optionOne === optionTwo;
	}

	addProductsType() {
		this.formSubmitted = true;
		let tmpName: string = this.formTypeNameInputField.nativeElement.value;
		if (tmpName.length > 0) {
			this.productsService.saveProductType(new ProductType(null, this.tmpTypeName)).subscribe(
				value => {
					this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dodano  kategorię główna', 5000);
				}, error => {
					this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ', 5000);
				});
			this.formSubmitted = false;
			this.tmpTypeName = "";
			this.addProductTypeDialogShow = false;
			this.refreshData();
		}
	}


	addProductsSubType(subCatAddForm: NgForm) {
		this.formSubmitted2 = true;
		let tmpName: string = this.formSubTypeNameInputField.nativeElement.value;
		if (tmpName.length > 0 && this.subCategory.productType) {
			this.productsService.saveProductSubType(this.subCategory).subscribe(
				value => {
					this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dodano podkategorię', 5000);
				}, error => {
					this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ', 5000);
				});
			this.formSubmitted2 = false;
			this.tmpSubTypeName = "";
			this.addProductSubTypeDialogShow = false;
			this.refreshData();
			console.log(this.hd);
			this.hd.nativeElement.value =null;
			console.log(this.hd);
			this.subCategory = new ProductSubType();
			subCatAddForm.resetForm();

		}
	}


	goToEditPage(subcat: ProductSubType){
		this.editProductSubTypeDialogShow = true;
		this.subCategoryToEdit = subcat;
		console.log(this.subCategoryToEdit.productType);
	}


	editProductsSubType(subCatEditForm: NgForm) {
		this.formSubmitted3 = true;


		console.log(subCatEditForm);
		console.log(this.subCategoryToEdit.productType);

		if (subCatEditForm.valid && this.subCategoryToEdit.productType) {
			this.productsService.saveProductSubType(this.subCategoryToEdit).subscribe(
				value => {
					this.messageServiceExt.addMessageWithTime('success', 'Status', 'Edytowano pomyślnie podkategorie', 5000);
				}, error => {
					this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ', 5000);
				});
			this.formSubmitted3 = false;
			this.editProductSubTypeDialogShow = false;
			this.refreshData();

			subCatEditForm.resetForm();
			this.subCategoryToEdit = new ProductSubType();

		}
	}


}
