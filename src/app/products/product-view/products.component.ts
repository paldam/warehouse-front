import {AfterViewChecked, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized} from '@angular/router';
import {ConfirmationService, DataTable, SelectItem} from "primeng/primeng";
import {isUndefined} from "util";
import {filter} from 'rxjs/operators';
import {pairwise} from "rxjs/internal/operators";
import {ProductsService} from "../products.service";
import {Product} from "../../model/product.model";
import {consoleTestResultsHandler} from "tslint/lib/test";
import {AuthenticationService} from "../../authentication.service";
import {AppConstants} from "../../constants";
import {ProductType} from "../../model/product_type.model";
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
	public findInputtext: string = "";
	public showBasketsContainsSpecyficProductModal: boolean = false;
	public basketsListByProduct: any[];
	public dataFilterLoaded: Promise<boolean>;
	public productsType: SelectItem[] = [];
	public suppliers: SelectItem[] = [];
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	@ViewChild('dt') dataTable: DataTable;

	constructor(private productsService: ProductsService, activeRoute: ActivatedRoute, public spinerService: SpinerService,
				private router: Router, private confirmationService: ConfirmationService,
				private authenticationService: AuthenticationService) {
		productsService.getProducts().subscribe(data => this.products = data);
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
			this.productsService.getProducts().subscribe(data => this.products = data);
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
}
