import {Component, OnInit, ViewChild} from '@angular/core';
import {BasketService} from "../basket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Basket} from "../../model/basket.model";
import {BasketType} from "../../model/basket_type.model";
import {ProductsService} from "../../products/products.service";
import {Product} from "../../model/product.model";
import {BasketItems} from "../../model/basket_items.model";
import {NgForm} from '@angular/forms';
import {DataTable, FileUpload, SelectItem} from "primeng/primeng";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {BasketSeason} from "../../model/basket_season.model";
import {Supplier} from "../../model/supplier.model";
import {AppConstants} from "../../constans";

@Component({
	selector: 'app-gift-basket-edit',
	templateUrl: './gift-basket-edit.component.html',
	styleUrls: ['./gift-basket-edit.component.css']
})
export class GiftBasketEditComponent
	implements OnInit {
	public basket: Basket = new Basket();
	public basketTypes: BasketType[] = [];
	public basketItems: BasketItems[] = [];
	public products: Product[] = [];
	public total: number = 0;
	public formSubmitted: boolean = false;
	public loading: boolean;
	public isAddNewImg: boolean;
	public productTmp: Product[] = [];
	public fileToUpload: File = null;
	public basketImege: any = null;
	public basketSeasonSelectItemList: SelectItem[] = [];
	public suppliers: SelectItem[] = [];
	public basketSeasonList: BasketSeason[] = [];
	@ViewChild(FileUpload) fileUploadElement: FileUpload;
	@ViewChild('dt') dataTable: DataTable;

	constructor(private productsService: ProductsService, private basketService: BasketService,
				private router: Router, activeRoute: ActivatedRoute, private messageServiceExt: MessageServiceExt) {
		basketService.getBasket(activeRoute.snapshot.params["basketId"]).subscribe(data => {
			this.basket = data;
			this.basketItems = data.basketItems;
			this.basket.basketTotalPrice /= 100;
		});
		this.basketService.getBasketSeason().subscribe(data => {
			this.basketSeasonList = data;
			this.basketSeasonList.forEach(value => {
				this.basketSeasonSelectItemList.push({label: value.basketSezonName, value: value})
			})
		});
		productsService.getSuppliers().subscribe(data => {
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
		});
		productsService.getProducts().subscribe(data => this.products = data);
		this.getBasketImage(activeRoute.snapshot.params["basketId"]);
	}

	ngOnInit() {
		setTimeout(() => {
			this.recalculate();
		}, 700);
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

	compareBasketType(optionOne: BasketType, optionTwo: BasketType): boolean {
		return optionTwo && optionTwo ? optionOne.basketTypeId === optionTwo.basketTypeId : optionOne === optionTwo;
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

	filtrOnlyAvaileble(event) {
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
		if (this.basketItems.length == 0) {
			return true
		} else {
			return false
		}
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

	handleFileInput(event) {
		this.fileToUpload = this.fileUploadElement.files[0];
		if (this.fileUploadElement.files.length == 1) {
			this.fileUploadElement.disabled = true;
			this.isAddNewImg = true;
		} else {
			this.isAddNewImg = false;
		}
	}

	enableUploadButton() {
		this.fileUploadElement.disabled = false;
	}

	setWheterImgIsSet() {
		this.isAddNewImg = false;
	}

	submitForm(form: NgForm) {
		this.formSubmitted = true;
		if (this.isFormValid(form)) {
			if (!this.basket.basketSezon) {
				this.basket.basketSezon = new BasketSeason(0) //todo
			}
			this.basket.basketProductsPrice = this.total;
			this.basket.basketItems = this.basketItems;
			this.basket.basketTotalPrice *= 100;
			if (this.basket.basketType.basketTypeId == 1) {
				this.isAddNewImg ?
					this.performActionForBasketWithNewImg(form) : this.performActionForBasketWhichHasImgInDb(form);
			} else {
				if (this.isAddNewImg) {
					this.performActionForBasketWithNewImg(form)
				} else {
					this.basket.isBasketImg ?
						this.performActionForBasketWhichHasImgInDb(form) : this.performActionForBasketWhitoutNewImgAndImgInDb(form);
				}
			}
		}
	}

	private performActionForBasketWithNewImg(form: NgForm) {
		this.basketService.saveBasketWithImg(this.basket, this.fileToUpload).subscribe(data => {
			this.basket = new Basket();
			this.basketItems = [];
			form.resetForm();
			this.formSubmitted = false;
			this.recalculate();
			this.router.navigateByUrl('/baskets');
		})
	}

	private performActionForBasketWhichHasImgInDb(form) {
		this.basketService.saveBasketWithoutImg(this.basket).subscribe(data => {
			this.basket = new Basket();
			this.basketItems = [];
			form.resetForm();
			this.formSubmitted = false;
			this.recalculate();
			this.router.navigateByUrl('/baskets');
		})
	}

	private performActionForBasketWhitoutNewImgAndImgInDb(form: NgForm) {
		this.basketService.addBasket(this.basket).subscribe(data => {
			},
			error => {
				this.messageServiceExt.addMessage(
					'error', 'Błąd', "Status: " + error.status + ' ' + error.statusText)
			},
			() => {
				this.messageServiceExt.addMessage(
					'success', 'Status', 'Poprawnie edytowano kosz');
				this.basket = new Basket();
				this.basketItems = [];
				form.resetForm();
				this.formSubmitted = false;
				this.recalculate();
				this.fileUploadElement.clear();
				this.router.navigateByUrl('/baskets');
			});
	}

	private isFormValid(form: NgForm) {
		if (this.basket.basketType) {
			if (this.basket.basketType.basketTypeId == 1) {
				return form.valid && this.basketItems.length > 0 && (this.fileUploadElement.files.length == 1 ||
					   this.basket.isBasketImg == 1)
			} else {
				return form.valid && this.basketItems.length > 0;
			}
		} else {
			return false;
		}
	}

	getBasketImage(basketId: number) {
		this.basketService.getBasketImg(basketId).subscribe(res => {
			let reader = new FileReader();
			reader.addEventListener("load", () => {
				this.basketImege = reader.result;
			}, false);
			if (res) {
				reader.readAsDataURL(res);
			}
		});
	}
}
