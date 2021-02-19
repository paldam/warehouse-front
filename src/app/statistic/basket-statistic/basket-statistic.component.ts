import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {BasketService} from "../../basket/basket.service";
import {CalendarSetingsComponent} from "../../primeNgCalendarSetings/calendarStings.component";
import * as XLSX from "xlsx";
import {DataTable} from "primeng/primeng";
import {Router} from "@angular/router";
import {AppConstants} from "../../constants";
import {RoutingState} from "../../routing-stage";
declare var $: any;

@Component({
	selector: 'app-basket-statistic',
	templateUrl: './basket-statistic.component.html',
	styleUrls: ['./basket-statistic.component.css']
})
export class BasketStatisticComponent
	implements OnInit {
	public basketStatistic: any[] = [];
	value: Date;
	dateLang: any;
	public startDate: string = '2018-08-07';
	public endDate: string = '2018-08-07';
	public maxDate: Date;
	public loading: boolean = false;
	public formSubbmitted: boolean = false;
	public dateError: boolean = false;
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	@ViewChild('sortByOrderDate') sortByOrderDateCheckBox: ElementRef;
	@ViewChild('dt') el: DataTable;

	constructor(private basketService: BasketService, private calendarSetingsComponent: CalendarSetingsComponent,
                private router: Router, private routerStage :RoutingState
	) {
	}

	ngOnInit() {
		this.dateLang = this.calendarSetingsComponent.dateLang;
		let today = new Date();
		this.startDate = today.toISOString().substring(0, 10);
		this.endDate = today.toISOString().substring(0, 10);
		this.maxDate = today;
	}

	submitOrderForm(form: NgForm) {
		this.formSubbmitted = true;
		if (this.startDate > this.endDate) {
			this.dateError = true;
			this.basketStatistic = [];
		} else {
			this.dateError = false;
			if (this.sortByOrderDateCheckBox.nativeElement.checked) {
				this.basketService.getNumberOfBasketOrderedFilteredByOrderDate(this.startDate, this.endDate)
					.subscribe(data => {
						this.basketStatistic = data;
					})
			} else {
				this.basketService.getNumberOfBasketOrdered(this.startDate, this.endDate)
					.subscribe(data => {
						this.basketStatistic = data;
					})
			}
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
			dataToGenerateFile[i] = {
				"Nazwa Kosza": filt[i].basketName,
				"Ilość": filt[i].quantity,
				"Ilość zamówień z tym koszem": filt[i].numberOfOrdersWhereBasketOccur
			}
		}
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToGenerateFile);
		const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
		let today = new Date();
		let date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
		let fileName = "Zestawienie_" + date + ".xls";
		XLSX.writeFile(workbook, fileName, {bookType: 'xls', type: 'buffer'});
	}

	goToOrderListByBasket(id,isByOrderDate) {
		this.router.navigate(["/orders/all", {id: id, startDate: this.startDate, endDate: this.endDate, isByOrderDate}]);


	}
}
