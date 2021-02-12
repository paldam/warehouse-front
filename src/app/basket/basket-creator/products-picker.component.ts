import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProductsService} from '../../products/products.service';
import {Product} from '../../model/product.model';
import {BasketItems} from '../../model/basket_items.model';
import {Basket} from '../../model/basket.model';
import {BasketType} from '../../model/basket_type.model';
import {BasketService} from '../basket.service';
import {NgForm} from '@angular/forms';
import {GiftBasketComponent} from '../basket-helper-list/gift-baskets.component';
import {DataTable, FileUpload, LazyLoadEvent, SelectItem} from "primeng/primeng";
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
	public formSeasonSubmitted: boolean = false;
	public fileToUpload: File = null;
	public loading: boolean;
	public basketPatterPickDialogShow: boolean = false;
	public basketSeasonSelectItemList: SelectItem[] = [];
	public productsType: SelectItem[] = [];
	public suppliers: SelectItem[] = [];
	public basketSeasonList: BasketSeason[] = [];
	public filtersLoaded: Promise<boolean>;
	public expandedRowBasketId: number = 0;
	public imageToShow: any;
	public showImageFrame: boolean = false;
	public suppliersList: Supplier[] = [];
	@ViewChild('dt') dataTable: DataTable;
	@ViewChild(GiftBasketComponent) giftBasketComponent: GiftBasketComponent;
	@ViewChild(FileUpload) fileUploadElement: FileUpload;
	@ViewChild('availablecheck') availablecheck: ElementRef;
	private totalRecords: number;
	private totalBasketRecords: number;

	constructor(private productsService: ProductsService, private basketService: BasketService,
				private messageServiceExt: MessageServiceExt) {

		productsService.getProductsPage(0,20,"","productName",-1,[],[],false)
			.subscribe((data: any) => {
				this.products = data.productList;
				this.totalRecords = data.totalRowsOfRequest;
			});

		this.basketService.getBasketSeason().subscribe(data => {
			this.basketSeasonList = data;
			this.basketSeasonList.forEach(value => {
			this.basketSeasonSelectItemList.push({label: value.basketSezonName, value: value});
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


	filtrOnlyAvaileble() {
		this.dataTable._filter();
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
			this.assignProductPosition();
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
		this.basketService
			.getBasketsPage(0,20,"","basketName", -1, false,[])
			.subscribe((data: any) => {
				this.basketsToSchema = data.basketsList;
				this.totalBasketRecords = data.totalRowsOfRequest;
			});
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

	showProductImg(event, productId: number) {
		this.productsService.getProductImg(productId).subscribe(res => {
			this.createImageFromBlob(res);
		});
		this.showImageFrame = true;
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

	private assignProductPosition() {
		this.basketItems.forEach((basketItem,index) => {
				basketItem.position= index+1
			}
		)
	}

	private createImageFromBlob(image: Blob) {
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			this.imageToShow = reader.result;
		}, false);
		if (image) {
			reader.readAsDataURL(image);
		}
	}
}