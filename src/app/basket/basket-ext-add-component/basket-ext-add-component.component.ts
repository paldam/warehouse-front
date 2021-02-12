import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {LazyLoadEvent, MenuItem, SelectItem} from 'primeng/api';
import {BasketService} from "../basket.service";
import {DataTable} from "primeng/primeng";

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
	public totalRecords: number = 0;
	public basketPatterPickDialogShow: boolean = false;
	public checkedAlcoholic: boolean = false;
	public suppliers: SelectItem[] = [];
	public items: MenuItem[];
	@ViewChild(GiftBasketComponent) giftBasketComponent: GiftBasketComponent;
	@ViewChild('availablecheck') availablecheck: ElementRef;
	@ViewChild('dt') dataTable: DataTable;
	private totalBasketRecords: number;

	constructor(private productsService: ProductsService, private basketExtService: BasketExtService,
                private basketService: BasketService, private dataUtils: JhiDataUtils) {
		productsService.getProductsPage(0,20,"","productName",-1,[],[],false)
			.subscribe((data: any) => {
				this.products = data.productList;
				this.totalRecords = data.totalRowsOfRequest;
			});

		basketExtService.getBasketsTypes().subscribe(data => this.basketTypes = data);

		productsService.getSuppliers().subscribe(data => {
			this.suppliers.push({label: '-- Wszyscy Dostawcy --', value: null});
			data.forEach(data => {
				this.suppliers.push({label: data.supplierName, value: data.supplierId});
			})
		});
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

	filtrOnlyAvailable() {
		this.dataTable._filter();
	}

	loadBasketsLazy(event: LazyLoadEvent) {
		this.loading = true;
		let pageNumber = 0;
		if (event.first) {
			pageNumber = event.first / event.rows;
		}
		let sortField = event.sortField;
		if (sortField == undefined) {
			sortField = "basketName";
		}
		let basketSeasonList: any[] = [];
		if (event.filters != undefined && event.filters["basketSezon.basketSezonName"] != undefined) {
			basketSeasonList = event.filters["basketSezon.basketSezonName"].value;
		}
		this.basketService
			.getBasketsPage(
				pageNumber, event.rows, event.globalFilter, sortField, event.sortOrder,false, basketSeasonList)
			.subscribe((data: any) => {
					this.basketsToSchema = data.basketsList;
					this.totalBasketRecords = data.totalRowsOfRequest;
				}, null
				, () => {
					this.loading = false;
				})
	}

	getOrderAdditional(event) {
		if (event.data) {
			this.expandedRowBasketId = event.data.basketId;
			let index;
			let dataTmp;
			this.basketService.getBasket(event.data.basketId).subscribe(data => {
				index = this.basketsToSchema.findIndex((value: Basket) => {
					return value.basketId == event.data.basketId;
				});
				dataTmp = data;
				this.basketsToSchema[index].basketItems = dataTmp.basketItems;
			})
		}
	}
	loadProductsLazy(event: LazyLoadEvent) {
		console.log(event.filters);
		this.loading = true;
		let pageNumber = 0;
		if (event.first) {
			pageNumber = event.first / event.rows;
		}
		let sortField = event.sortField;
		if (sortField == undefined) {
			sortField = "productName";
		}
		let productSubTypeFilter: any[] = [];
		if (event.filters != undefined && event.filters["productSubType.subTypeName"] != undefined) {
			productSubTypeFilter = event.filters["productSubType.subTypeName"].value;
		}
		let basketSeasonFilter: any[] = [];
		if (event.filters != undefined && event.filters["suppliers"] != undefined) {
			basketSeasonFilter = event.filters["suppliers"].value;
		}
		this.productsService
			.getProductsPage(pageNumber, event.rows, event.globalFilter, sortField, event.sortOrder, productSubTypeFilter,basketSeasonFilter,this.availablecheck.nativeElement.checked)
			.subscribe((data: any) => {
					this.products = data.productList;
					this.totalRecords = data.totalRowsOfRequest;
				}, null
				, () => {
					this.loading = false;
				})
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
			this.assignProductPosition();
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

	private assignProductPosition() {
		this.basketItems.forEach((basketItem,index) => {
				basketItem.position= index+1
			}
		)
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