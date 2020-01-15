import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProductsService} from "../products.service";
import {Supplier} from "../../model/supplier.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {Router} from "@angular/router";
import {DataTable} from "primeng/primeng";
import {SpinerService} from "../../spiner.service";

@Component({
	selector: 'app-product-delivery',
	templateUrl: './product-delivery.component.html',
	styleUrls: ['./product-delivery.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ProductDeliveryComponent
	implements OnInit {
	public selectedSupplier: Supplier = new Supplier();
	public productSuppliers: Supplier[] = [];
	public dd: any[] = [];
	public productsBySupplier: any[] = [];
	public products: any[] = [];
	public loading: boolean;
	public stock: number;
	public selectedSupplierId: number;
	public gb: any;
	public legend: string;
	public currentPageMode: number;
	public findInputtextOrder: any;
	@ViewChild('globalfilter') el: ElementRef;
	@ViewChild('dt') dataTable: DataTable;

	constructor(private productsService: ProductsService, private spinerService: SpinerService,
				private messageServiceExt: MessageServiceExt, public router: Router) {
		if (router.url == '/products/delivery') {
			this.legend = "Dostawa produktów";
			this.currentPageMode = 1;  //
		}
		if (router.url == '/products/setdelivery') {
			this.legend = "Zamówienie produktów";
			this.currentPageMode = 2;
		}
		productsService.getSuppliers().subscribe(data => {
			this.productSuppliers = data;
		}, error1 => {
		}, () => {
			this.productSuppliers.unshift(new Supplier(-99, 'WSZYSCY DOSTAWCY', null, null, null, null, null))
		});
		this.productsService.getProducts().subscribe(data => this.products = data);
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

	selectSupplier(id: number) {
		this.selectedSupplierId = id;
		this.productsService.getProductsBySupplier(id).subscribe((data: any) => {
			data.forEach(function (obj) {
				obj.add = obj.tmpOrdered;
			});
			this.productsBySupplier = data;
		})
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

	updateStockRow(event: any) {
		if (event.data.tmpOrdered < 0) {
			event.data.tmpOrdered = 0;
		}
		this.productsService.saveProduct(event.data).subscribe(data => {
			this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji stanu produktu', 1000);
		}, error => {
			this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);
		});
	}

	refreshData() {
		this.spinerService.showSpinner = true;
		this.productsService.getProducts().subscribe(data => {
			this.products = data
		}, error1 => {
			this.spinerService.showSpinner = false;
		}, () => {
			this.spinerService.showSpinner = false;
		});
	}

	addToStockOrToOrder(id: number, add: number) {
		if (this.currentPageMode == 1) {
			this.productsService.changeStockEndResetOfProductsToDelivery(id, add).subscribe(data => {
				this.refreshData();
			});
		}
		if (this.currentPageMode == 2) {
			this.productsService.addNumberOfProductsDelivery(id, add).subscribe(data => {
				this.refreshData();
			})
		}
	}

	getRowStyle(rowData: any, rowIndex: number): string {
		let timeNow = new Date().getTime();
		if ((timeNow - rowData.lastStockEditDate) / 1000 / 60 < 60) {
			return 'ddd'
		} else {
			return ''
		}
	}

	getRowStyle2(rowData: any, rowIndex: number): string {
		let timeNow = new Date().getTime();
		if ((timeNow - rowData.lastNumberOfOrderedEditDate) / 1000 / 60 < 60) {
			return 'ddd'
		} else {
			return ''
		}
	}
}
