import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RoutesRecognized} from '@angular/router';
import {ConfirmationService, DataTable, LazyLoadEvent, SelectItem} from "primeng/primeng";
import {ProductsService} from "../products.service";
import {Product} from "../../model/product.model";
import {AuthenticationService} from "../../authentication.service";
import {AppConstants} from "../../constants";
import {ProductSubType} from "../../model/product_sub_type";
import {Supplier} from "../../model/supplier.model";
import {SpinerService} from "../../spiner.service";
import {RoutingState} from "../../routing-stage";

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit,OnDestroy {
	public loading: boolean;
	public products: Product[] = [];
	public imageToShow: any;
	public showImageFrame: boolean = false;
	public findInputtext: string = "";
	public showBasketsContainsSpecyficProductModal: boolean = false;
	public basketsListByProduct: any[];
	public dataFilterLoaded: Promise<boolean>;
	public totalRecords: number;
	public productsType: SelectItem[] = [];
	public suppliers: SelectItem[] = [];
	public suppliersDropDown: any;
	public productTypeMultiSelect: any;
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	@ViewChild('dt') dataTable: DataTable;
	public routerObserver = null;

	constructor(private productsService: ProductsService, activeRoute: ActivatedRoute, public spinerService: SpinerService,
				private router: Router, private confirmationService: ConfirmationService,private routingState: RoutingState,
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

		this.checkIfUpdateOrderRowAfterRedirectFromProductDetails();
	}

	ngOnInit() {
		this.setCustomSupplierFilterToDataTable();

	}

	ngOnDestroy() {
		this.routerObserver.unsubscribe();
	}

	private checkIfUpdateOrderRowAfterRedirectFromProductDetails(){
		this.routerObserver =this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				if (this.routingState.getPreviousUrl().substr(0, 16) == '/product/detail/') {
					let id = parseInt(this.routingState.getPreviousUrl().substr(16, this.routingState.getPreviousUrl().length));
					this.refreshProductRowInDataTable(id);

				}
			}
		})

	}
	private refreshProductRowInDataTable(id :number){
		this.productsService.getProduct(id).subscribe(data => {
			let index = this.products.findIndex((value: Product) => {
				return value.id == id;
			});
			this.products[index] = data;
			this.products = this.products.slice(); //Tip to refresh PrimeNg datatable
			this.toggleRow(id);

		}, error => {
		}, () => {
			this.goToSavedScrollPosition();
		})
	}

	private goToSavedScrollPosition(){
		window.scrollTo(0, this.routingState.getlastScrollYPosition());
	}

	private toggleRow(productId: number){
		let rowIndex = this.products.findIndex(value => value.id == productId);
		this.dataTable.toggleRow(this.products[rowIndex]);
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
			this.cleanFilter();
			this.loading = false;
		}, 1000);
	}


	cleanFilter(){
		this.suppliersDropDown = [];
		this.productTypeMultiSelect=[];
		this.findInputtext='';
	}

	goToEditPage(index, id) {
		this.routingState.setlastScrollYPosition(window.scrollY);
		this.router.navigate(["/product/detail/", id]);

	}

	goToEditBasketPage(id) {
		this.router.navigate(["/basket/detail/", id]);
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
