import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductsService} from '../../products/products.service';
import {Product} from '../../model/product.model';
import {BasketItems} from '../../model/basket_items.model';
import {Basket} from '../../model/basket.model';
import {BasketType} from '../../model/basket_type.model';
import {BasketService} from '../basket.service';
import {NgForm} from '@angular/forms';
import {GiftBasketComponent} from '../basket-helper-list/gift-baskets.component';
import {DataTable, FileUpload, SelectItem} from "primeng/primeng";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {BasketSeason} from "../../model/basket_season.model";
import {Supplier} from "../../model/supplier.model";
import {ProductSubType} from "../../model/product_sub_type";
import {AppConstants} from "../../constants";

@Component({
	selector: 'products-picker',
	templateUrl: './products-picker.component.html',
	styleUrls: ['./products-picker.component.css']
})
export class ProductPickerComponent
	implements OnInit {
	public products: Product[] = [];
	public productTmp: Product[] = [];
	public basketItems: BasketItems[] = [];
	public basketTypes: BasketType[] = [];
	public basket: Basket = new Basket();
	public basketsToSchema: Basket[] = [];
	public total: number = 0;
	public formSubmitted: boolean = false;
	public fileToUpload: File = null;
	public loading: boolean;
	public basketPatterPickDialogShow: boolean = false;
	public basketSeasonSelectItemList: SelectItem[] = [];
	public productsType: SelectItem[] = [];
	public suppliers: SelectItem[] = [];
	public basketSeasonList: BasketSeason[] = [];
	public filtersLoaded: Promise<boolean>;
	public suppliersList: Supplier[] = [];
	@ViewChild('dt') dataTable: DataTable;
	@ViewChild(GiftBasketComponent) giftBasketComponent: GiftBasketComponent;
	@ViewChild(FileUpload) fileUploadElement: FileUpload;

	constructor(private productsService: ProductsService, private basketService: BasketService,
				private messageServiceExt: MessageServiceExt) {

		productsService.getProducts().subscribe(data => this.products = data);
		this.basketService.getBasketSeason().subscribe(data => {
			this.basketSeasonList = data;
			this.basketSeasonList.forEach(value => {
				this.basketSeasonSelectItemList.push({label: value.basketSezonName, value: value})
			})
		});
		productsService.getProductsSubTypes().subscribe((data: ProductSubType[]) => {
			data.forEach(value => {
				this.productsType.push({
					label: '' + value.subTypeName + '(' + value.productType.typeName + ')',
					value: value.subTypeName
				});
			});
			productsService.getSuppliers().subscribe(data => {
				this.suppliers.push({label: '-- Wszyscy Dostawcy --', value: null});
				data.forEach(data => {
					this.suppliers.push({label: data.supplierName, value: data.supplierId});
				})
			});
		});
		basketService.getBasketsTypes().subscribe(data => {
			this.basketTypes = data;
			this.basketTypes = this.basketTypes
				.filter(value => {
					return value.basketTypeId != AppConstants.BASKET_TYPE_ID_ARCHWIUM;
				})
				.filter(value => {
					return value.basketTypeId != AppConstants.BASKET_TYPE_ID_USUNIETY;
				})
				.filter(value => {
					return value.basketTypeId != AppConstants.BASKET_TYPE_ID_EXPORTOWY;
				});
			this.filtersLoaded = Promise.resolve(true);
		});
		productsService.getSuppliers().subscribe(data => {
			this.suppliersList = data;
		});
	}

	ngOnInit() {
		this.setCustomSupplierFilterToDataTable();
	}

	private setCustomSupplierFilterToDataTable() {
		this.dataTable.filterConstraints['inCollection'] = function inCollection(value: Supplier[], filter: any): boolean {
			if (filter === undefined || filter === null) {
				return true;
			}
			if (value === undefined || value === null || value.length === 0) {
				return false;
			}
			if (filter == -99) {
				return true;
			}
			for (let i = 0; i < value.length; i++) {
				if (value[i].supplierId == filter) {
					return true;
				}
			}
			return false;
		};
	}

	addProductToGiftBasket(product: Product) {
		let line = this.basketItems.find(data => data.product.id == product.id);
		if (line == undefined) {
			this.basketItems.push(new BasketItems(product, 1))
		} else {
			line.quantity = line.quantity + 1;
		}
		this.recalculate();
	}

	filerOnlyAvailable(event) {
		let isChecked = event.target.checked;
		if (isChecked) {
			if (this.productTmp.length == 0) {
				this.productTmp = this.products;
			}
			this.products = this.products.filter(data => data.stock > 0);
		} else {
			this.products = this.productTmp;
		}
	}

	isProductLinesEmpty(): boolean {
		return this.basketItems.length == 0;
	}

	updateQuantity(productLine: BasketItems, quantity: number) {
		let line = this.basketItems.find(line => line.product.id == productLine.product.id);
		if (line != undefined) {
			line.quantity = Number(quantity);
		}
		this.recalculate();
	}

	deleteProductLine(id: number) {
		let index = this.basketItems.findIndex(data => data.product.id == id);
		if (index > -1) {
			this.basketItems.splice(index, 1);
		}
		this.recalculate();
	}

	recalculate() {
		this.total = 0;
		this.basketItems.forEach(data => {
			this.total += data.product.price * data.quantity;
		})
	}

	submitForm(form: NgForm) {
		this.formSubmitted = true;
		if (this.isFormValid(form)) {
			this.basket.basketItems = this.basketItems;
			this.basket.basketTotalPrice *= 100;
			this.basket.isAlcoholic = 0;
			this.basket.isAvailable = 0;
			this.basket.stock = 0;
			this.basket.basketProductsPrice = this.total;
			if (!this.basket.basketSezon) {
				this.basket.basketSezon = new BasketSeason(AppConstants.BASKET_SEASON_ID_NONE)
			}
			if (this.fileUploadElement.files.length == 1) {
				this.basketService.saveBasketWithImg(this.basket, this.fileToUpload).subscribe(data => {
					},
					error => {
						this.messageServiceExt.addMessage(
							'error', 'Błąd', "Status: " + error.status + ' ' + error.statusText)
					},
					() => {
						this.messageServiceExt.addMessage(
							'success', 'Status', 'Poprawnie dodano kosz');
						this.basket = new Basket();
						this.basketItems = [];
						form.resetForm();
						this.formSubmitted = false;
						this.recalculate();
						this.fileUploadElement.clear();
						this.giftBasketComponent.refreshData();
					});
			}
			else {
				this.basketService.addBasket(this.basket).subscribe(data => {
						console.log(this.basket);
					},
					error => {
						this.messageServiceExt.addMessage(
							'error', 'Błąd', "Status: " + error.status + ' ' + error.statusText)
					},
					() => {
						this.messageServiceExt.addMessage(
							'success', 'Status', 'Poprawnie dodano kosz');
						this.basket = new Basket();
						this.basketItems = [];
						form.resetForm();
						this.formSubmitted = false;
						this.recalculate();
						this.fileUploadElement.clear();
						this.giftBasketComponent.refreshData();
					});
			}
		}
	}

	private isFormValid(form: NgForm) {
		if (this.basket.basketType) {
			if (this.basket.basketType.basketTypeId == 1) {
				return form.valid && this.basketItems.length > 0 && this.fileUploadElement.files.length == 1;
			} else {
				return form.valid && this.basketItems.length > 0;
			}
		} else {
			return false;
		}
	}

	pickBasket(basket: Basket) {
		basket.basketItems.map(data => {(data.basketItemsId = null)});
		this.basketItems = basket.basketItems;
		this.basketPatterPickDialogShow = false;
	}

	showBasketPatterList() {
		this.basketPatterPickDialogShow = true;
		this.basketService.getBasketsWithDeleted().subscribe(data => this.basketsToSchema = data);
	}

	handleFileInput(event) {
		this.fileToUpload = this.fileUploadElement.files[0];
		if (this.fileUploadElement.files.length == 1) {
			this.fileUploadElement.disabled = true;
		}
	}

	enableUploadButton() {
		this.fileUploadElement.disabled = false;
	}
}