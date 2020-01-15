import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductsService} from '../../products/products.service';
import {Product} from '../../model/product.model';
import {BasketItems} from '../../model/basket_items.model';
import {Basket} from '../../model/basket.model';
import {BasketType} from '../../model/basket_type.model';
import {BasketExtService} from '../basket-ext.service';
import {NgForm} from '@angular/forms';
import {GiftBasketComponent} from '../basket-helper-list/gift-baskets.component';
import {JhiDataUtils} from 'ng-jhipster';
import {BasketExt} from '../../model/BasketExt';
import {MenuItem} from 'primeng/api';
import {BasketService} from "../basket.service";

@Component({
	selector: 'app-basket-ext-add-component',
	templateUrl: 'basket-ext-add-component.component.html',
	styleUrls: ['basket-ext-add-component.component.css']
})
export class BasketExtAddComponentComponent
	implements OnInit {
	public products: Product[] = [];
	public productTmp: Product[] = [];
	public basketItems: BasketItems[] = [];
	public basketTypes: BasketType[] = [];
	public basket: BasketExt = new BasketExt;
	public basketsToSchema: Basket[] = [];
	public total: number = 0;
	public formSubmitted: boolean = false;
	public loading: boolean;
	public basketPatterPickDialogShow: boolean = false;
	public checkedAlcoholic: boolean = false;
	public items: MenuItem[];
	@ViewChild(GiftBasketComponent) giftBasketComponent: GiftBasketComponent;

	constructor(private productsService: ProductsService, private basketExtService: BasketExtService,
                private basketService: BasketService, private dataUtils: JhiDataUtils) {
		productsService.getProducts().subscribe(data => this.products = data);
		basketExtService.getBasketsTypes().subscribe(data => this.basketTypes = data);
	}

	ngOnInit() {
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
		if (form.valid && this.basketItems.length > 0) {
			this.basket.basketItems = this.basketItems;
			this.basket.basketTotalPrice *= 100;
			if (this.checkedAlcoholic == true) {
				this.basket.isAlcoholic = 1;
			} else {
				this.basket.isAlcoholic = 0;
			}
			this.basket.isAvailable = 1;
			this.basketExtService.saveBasket(this.basket).subscribe(data => {

					this.basket = new BasketExt();
					this.basketItems = [];
					form.resetForm();
					this.formSubmitted = false;
					this.recalculate();
				},
				err => console.log("error "));
		}
	}

	pickBasket(basket: Basket) {
		basket.basketItems.map(data => {(data.basketItemsId = null)});
		this.basketItems = basket.basketItems;
		this.basketPatterPickDialogShow = false;
	}

	showBasketPatterList() {
		this.basketPatterPickDialogShow = true;
		this.basketService.getBaskets().subscribe(data => this.basketsToSchema = data);
	}

	byteSize(field) {
		return this.dataUtils.byteSize(field);
	}

	openFile(contentType, field) {
		return this.dataUtils.openFile(contentType, field);
	}

	setFileData(event, entity, field, isImage) {
		this.dataUtils.setFileData(event, entity, field, isImage);
	}
}