import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProductsService} from "../../products/products.service";
import {CalendarSetingsComponent} from "../../primeNgCalendarSetings/calendarStings.component";
import {NgForm} from "@angular/forms";
import {ConfirmationService, SelectItem} from "primeng/api";
import * as XLSX from "xlsx";
import {DataTable} from "primeng/primeng";
import {AppConstants} from "../../constants";
import {ProductSubType} from "../../model/product_sub_type";
import {Supplier} from "../../model/supplier.model";
import {AuthenticationService} from "../../authentication.service";
import {SpinerService} from "../../spiner.service";
declare var $: any;

@Component({
	selector: 'app-statistic',
	templateUrl: './statistic.component.html',
	styleUrls: ['./statistic.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class StatisticComponent
	implements OnInit {
	public productsToOrder: any[] = [];
	value: Date;
	dateLang: any;
	public formSubmitted: boolean = false;
	public startDate: string;
	public endDate: string;
	public loading: boolean = false;
	public suppliers: SelectItem[] = [];
	public dateError: boolean = false;
	public deliveryFnAvailable: boolean = false;
	public productsType: SelectItem[] = [];
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	@ViewChild('dt') el: DataTable;

	constructor(private confirmationService: ConfirmationService, private productService: ProductsService,
				private calendarSetingsComponent: CalendarSetingsComponent,
				public authenticationService: AuthenticationService, public spinerService: SpinerService) {
		productService.getSuppliers().subscribe(data => {
			this.suppliers.push({label: '-- Wszyscy Dostawcy --', value: null});
			data.forEach(data => {
				this.suppliers.push({label: data.supplierName, value: data.supplierName});
			})
		});
		productService.getProductsSubTypes().subscribe((data: ProductSubType[]) => {
			data.forEach(value => {
				this.productsType.push({
					label: '' + value.subTypeName + '(' + value.productType.typeName + ')',
					value: value.subTypeName
				});
			})
		});
	}

	ngOnInit() {
		this.dateLang = this.calendarSetingsComponent.dateLang;
		let today = new Date();
		this.startDate = today.toISOString().substring(0, 10);
		this.endDate = today.toISOString().substring(0, 10);
		this.setCustomSupplierFilterToDataTable();
	}

	private setCustomSupplierFilterToDataTable() {
		this.el.filterConstraints['inCollection'] = function inCollection(value: Supplier[], filter: any): boolean {
			if (filter === undefined || filter === null) {
				return true;
			}
			if (value === undefined || value === null || value.length === 0) {
				return false;
			}
			for (let i = 0; i < value.length; i++) {
				if (value[i].supplierName.toLowerCase() === filter.toLowerCase()) {
					return true;
				}
			}
			return false;
		};
	}

	getProductsData() {
		this.spinerService.showSpinner = true;
		this.productService.getProductsToOrder(this.startDate, this.endDate)
			.subscribe(data => {
				this.productsToOrder = data;
				this.setAdditionalColumnWithConcatSupplierString();
				this.spinerService.showSpinner = false;
			}, error1 => {
				this.spinerService.showSpinner = false;
			}, () => this.productsToOrder.forEach(value => {
				value.valueForDeliver = value.suma - value.stock - value.tmpOrdered;
				this.spinerService.showSpinner = false;
			}))
	}

	submitOrderForm(form: NgForm) {
		this.formSubmitted = true;
		if (this.startDate > this.endDate) {
			this.dateError = true;
		} else {
			this.getProductsData()
		}
	}

	orderProducts() {
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz zamówić produkty widoczne w tabeli w ilościach z kolumny dostawa? ',
			accept: () => {
				this.spinerService.showSpinner = true;
				let productsIds: number [] = [];
				let deliveryValue: number [] = [];
				this.el.dataToRender.forEach(product => {
					productsIds.push(product.id);
					deliveryValue.push(product.valueForDeliver)
				});
				this.productService.setMultiDelivery(productsIds, deliveryValue).subscribe(value1 => {
				}, error => {
					this.getProductsData();
					this.deliveryFnAvailable = false;
				}, () => {
					this.getProductsData();
					this.deliveryFnAvailable = false;
				})
			},
			reject: () => {
			}
		});
	}

	private setAdditionalColumnWithConcatSupplierString() {
		this.productsToOrder.forEach(product => {
			let suppliersConcatString = '';
			product.suppliers.forEach((supplier: Supplier) => {
				suppliersConcatString = suppliersConcatString + " " + supplier.supplierName;
			});
			product.suppliersConcatString = suppliersConcatString;
		})
	}

	getRowStyle(rowData: any, rowIndex: number): string {
		let timeNow = new Date().getTime();
		if ((timeNow - rowData.lastEditNumberOfOrderedDate) / 1000 / 60 < 60) {
			return 'ddd';
		} else {
			return '';
		}
	}

	generateXls() {
		let filt: any[] = [];
		if (!this.el.filteredValue) {
			filt = this.el.value;
		} else {
			filt = this.el.filteredValue;
		}
		let dataToGenerateFile: any[] = [];
		for (let i = 0; i < filt.length; i++) {
			let tmpSupplierNameList = '';
			for (let n = 0; n < filt[i].suppliers.length; n++) {
				tmpSupplierNameList = tmpSupplierNameList + filt[i].suppliers[n].supplierName + " | ";
			}
			dataToGenerateFile[i] = {
				"Nazwa Produktu": filt[i].product_name,
				"Pojemność": filt[i].capacity,
				"Nazwa Dostawcy": tmpSupplierNameList,
				"Ilość": filt[i].suma,
				"Stan Magazynu": filt[i].stock,
				"Liczba zamówionych": filt[i].tmpOrdered
			}
		}
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToGenerateFile);
		const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
		let today = new Date();
		let date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
		let fileName = "Zestawienie_" + date + ".xls";
		XLSX.writeFile(workbook, fileName, {bookType: 'xls', type: 'buffer'});
	}
}
