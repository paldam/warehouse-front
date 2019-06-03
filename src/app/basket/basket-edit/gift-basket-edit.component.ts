import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BasketService} from "../basket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Basket} from "../../model/basket.model";
import {BasketType} from "../../model/basket_type.model";
import {BasketOrderComponent} from "../../order/basket-order/basket-order.component";
import {ProductsService} from "../../products/products.service";
import {Product} from "../../model/product.model";
import {BasketItems} from "../../model/basket_items.model";
import {NgForm} from '@angular/forms';
import {FileUpload} from "primeng/primeng";
import {MessageServiceExt} from "../../messages/messageServiceExt";

@Component({
	selector: 'app-gift-basket-edit',
	templateUrl: './gift-basket-edit.component.html',
	styleUrls: ['./gift-basket-edit.component.css']
})
export class GiftBasketEditComponent implements OnInit {

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
	@ViewChild(FileUpload) fileUploadElement: FileUpload;

	constructor(private productsService: ProductsService, private basketService: BasketService, private router: Router, activeRoute: ActivatedRoute, private messageServiceExt: MessageServiceExt) {

		basketService.getBasket(activeRoute.snapshot.params["basketId"]).subscribe(data => {

			this.basket = data;
			this.basketItems = data.basketItems;
			this.basket.basketTotalPrice /= 100;
		});

		basketService.getBasketsTypes().subscribe(data => {
			this.basketTypes = data;
			this.basketTypes = this.basketTypes
				.filter(value => {
					return value.basketTypeId != 999;
				})
				.filter(value => {
					return value.basketTypeId != 99;
				})
				.filter(value => {
					return value.basketTypeId != 100;
				})
		});

		productsService.getProducts().subscribe(data => this.products = data);

		this.getBasketImage(activeRoute.snapshot.params["basketId"]);

	}

	ngOnInit() {

		setTimeout(() => {
			this.recalculate();
		}, 700);

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
		var isChecked = event.target.checked;

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
			this.basket.basketItems = this.basketItems;
			this.basket.basketTotalPrice *= 100;

			if (this.basket.basketType.basketTypeId == 1) {
				this.isAddNewImg ? this.performActionForBasketWithNewImg(form) : this.performActionForBasketWhichHasImgInDb(form);
			} else {
				if (this.isAddNewImg) {
					this.performActionForBasketWithNewImg(form)
				} else {
					this.basket.isBasketImg ? this.performActionForBasketWhichHasImgInDb(form) : this.performActionForBasketWhitoutNewImgAndImgInDb(form);
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
				this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText)
			},
			() => {
				this.messageServiceExt.addMessage('success', 'Status', 'Poprawnie edytowano kosz');
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
				return form.valid && this.basketItems.length > 0 && (this.fileUploadElement.files.length == 1 || this.basket.isBasketImg == 1)
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
