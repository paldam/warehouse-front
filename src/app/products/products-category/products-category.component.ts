import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductsService} from "../products.service";
import {ProductType} from "../../model/product_type.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {Supplier} from "../../model/supplier.model";
import {ConfirmationService} from "primeng/api";
import {AuthenticationService} from "../../authentication.service";
import {CoreDataTableViewComponent} from "../../coreViewComponent";

@Component({
	selector: 'app-products-category',
	templateUrl: './products-category.component.html',
	styleUrls: ['./products-category.component.css']
})
export class ProductsCategoryComponent extends CoreDataTableViewComponent implements OnInit {
	public mainCategoriesList: ProductType[] = [];
	public tmpTypeName: string;
	public formSubmitted: boolean = false;
	public addProductTypeDialogShow: boolean = false;
	@ViewChild('type_name') formTypeNameInputField: any;

	constructor(private productsService: ProductsService, private messageServiceExt: MessageServiceExt, private confirmationService: ConfirmationService, private authenticationService: AuthenticationService) {
		super();
		productsService.getProductsTypes().subscribe(data => {
			this.mainCategoriesList = data;
		})
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

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.productsService.getProductsTypes().subscribe(data => this.mainCategoriesList = data);
			this.loading = false;
		}, 1000);

	}

	addTypeShow(){
		this.addProductTypeDialogShow = true;

	}

	closeSupplierAddDialog(){
		this.addProductTypeDialogShow = false;
	}


	addProductsType() {
		this.formSubmitted = true;
		let tmpName: string = this.formTypeNameInputField.nativeElement.value;
		if (tmpName.length > 0) {
			this.productsService.saveProductType(new ProductType(null, this.tmpTypeName)).subscribe(
				value => {
					this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dodano dostawcę', 5000);
				}, error => {
					this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ', 5000);
				})
			this.formSubmitted = false;
			this.tmpTypeName = "";
			this.addProductTypeDialogShow = false;
			this.refreshData();
		}
	}
}
