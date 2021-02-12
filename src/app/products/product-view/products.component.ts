import {AfterViewChecked, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized} from '@angular/router';
import {ConfirmationService, DataTable, LazyLoadEvent, SelectItem} from "primeng/primeng";
import {isUndefined} from "util";
import {filter} from 'rxjs/operators';
import {pairwise} from "rxjs/internal/operators";
import {ProductsService} from "../products.service";
import {Product} from "../../model/product.model";
import {AuthenticationService} from "../../authentication.service";
import {AppConstants} from "../../constants";
import {ProductSubType} from "../../model/product_sub_type";
import {Supplier} from "../../model/supplier.model";
import {SpinerService} from "../../spiner.service";

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {
	public loading: boolean;
	public products: Product[] = [];
	public lastVisitedPage: number;
	public imageToShow: any;
	public showImageFrame: boolean = false;
	public findInputtext: string = "";
	public showBasketsContainsSpecyficProductModal: boolean = false;
	public basketsListByProduct: any[];
	public dataFilterLoaded: Promise<boolean>;
	public totalRecords: number;
	public productsType: SelectItem[] = [];
	public suppliers: SelectItem[] = [];
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	@ViewChild('dt') dataTable: DataTable;

	constructor(private productsService: ProductsService, activeRoute: ActivatedRoute, public spinerService: SpinerService,
				private router: Router, private confirmationService: ConfirmationService,
				private authenticationService: AuthenticationService) {
		productsService.getProductsPage(0,20,"","productName",-1,[],[],false)
			.subscribe((data: any) => {
				this.products = data.productList;
				this.totalRecords = data.totalRowsOfRequest;
			});
		productsService.getProductsSubTypes().subscribe((data: ProductSubType[]) => {
			data.forEach(value => {
				this.productsType.push({
					label: '' + value.subTypeName + '(' + value.productType.typeName + ')',
					value: value.subTypeId
				});
			});
			productsService.getSuppliers().subscribe(data => {
				this.suppliers.push({label: '-- Wszyscy Dostawcy --', value: null});
				data.forEach(data => {
					this.suppliers.push({label: data.supplierName, value: data.supplierId});
				})
			});
		});
		this.router.events
			.pipe(filter((e: any) => e instanceof RoutesRecognized),
				pairwise()
			).subscribe((e: any) => {
			let previousUrlTmp = e[0].urlAfterRedirects;
			if (previousUrlTmp.search('/product') == -1) {
				localStorage.removeItem('findInputtext');
				localStorage.removeItem('lastPage');
			} else {
			}
		});
		if (localStorage.getItem('findInputtext')) {
			this.findInputtext = (localStorage.getItem('findInputtext'));
		} else {
			this.findInputtext = "";
		}
	}

	ngOnInit() {
		this.setCustomSupplierFilterToDataTable();
		setTimeout(() => {
			if (localStorage.getItem('lastPage')) {
				this.lastVisitedPage = parseInt(localStorage.getItem('lastPage'));
			}
			else {
				this.lastVisitedPage = 0;
			}
		}, 300);
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

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.productsService.getProductsPage(0,50,"","productName",1,[],[],false)
				.subscribe((data: any) => {
					this.products = data.productList;
					this.totalRecords = data.totalRowsOfRequest;
				});
			this.loading = false;
		}, 1000);
	}

	goToEditPage(index, id) {
		let pageTmp = ((index - 1) / 20) + 1;
		let first = this.dataTable.first;
		localStorage.setItem('lastPage', first.toString());
		let textTmp = this.findInputtext;
		localStorage.setItem('findInputtext', textTmp);
		this.router.navigate(["/product/", id]);
	}

	goToEditBasketPage(id) {
		this.router.navigate(["/basket/", id]);
	}

	selectProduct(id: number) {
		this.router.navigateByUrl('/products/${id}');
	}

	filterTableBySupplier(supplierId: number) {
		this.spinerService.showSpinner = true;
		setTimeout(() => {
			this.dataTable.filter(supplierId, 'suppliers', 'inCollection');
		}, 100);
		setTimeout(() => {
			this.spinerService.showSpinner = false;
		}, 1500);
	}

	ShowConfirmModal(product: Product) {
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz przenieś produkt  ' + product.productName + ' do archiwum ?',
			accept: () => {
				product.isArchival = 1;
				this.productsService.saveProduct(product).subscribe(data => {
					this.refreshData();
				});
			},
			reject: () => {
			}
		});
	}

	getBasketsContainsSpecyficProduct(productId: number) {
		this.showBasketsContainsSpecyficProductModal = true;
		this.productsService.getBasketsContainSpecyficProduct(productId).subscribe(data => {
			this.basketsListByProduct = data;
			this.dataFilterLoaded = Promise.resolve(true);
		})
	}

	showProductImg(event, productId: number) {
		this.productsService.getProductImg(productId).subscribe(res => {
			this.createImageFromBlob(res);
		});
		this.showImageFrame = true;
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
			.getProductsPage(pageNumber, event.rows, event.globalFilter, sortField, event.sortOrder, productSubTypeFilter,basketSeasonFilter,false)
			.subscribe((data: any) => {
					this.products = data.productList;
					this.totalRecords = data.totalRowsOfRequest;
				}, null
				, () => {
					this.loading = false;
				})
	}


}
