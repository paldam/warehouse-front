import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Order} from "../model/order.model";
import {Checkbox} from "primeng/primeng";
import {OrderService} from "../order/order.service";
import {File} from "../model/file";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'app-order-audit',
	templateUrl: './order-audit.component.html',
	styleUrls: ['./order-audit.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class OrderAuditComponent implements OnInit {

	public orderStateBeforeChange: Order = new Order();
	public orderStateAfterChange: Order = new Order();
	public revIdOfOrderStateAfterChange: number;
	public isDataFetchCompleteForAfterOrderState: Promise<boolean> = Promise.resolve(false);
	public isDataFetchCompleteForBeforeOrderState: Promise<boolean> = Promise.resolve(false);
	public customerDesc: string = "";
	public customerAfterDesc: string = "";

	public fileList: File[] = [];

	public additionalSaleCheckbox: boolean = false;
	public additionalSaleCheckboxForAfterOrderPanel: boolean = false;

	constructor(orderService: OrderService, activatedRoute: ActivatedRoute) {

		this.revIdOfOrderStateAfterChange = +activatedRoute.snapshot.paramMap.get('revId');// "+" parse to number

		orderService.getOrderPrevStateFromHistoryByRevId(this.revIdOfOrderStateAfterChange).subscribe(
			data => {
				this.orderStateBeforeChange = data[0];
				this.customerDesc = data[0].customer.name + " | Firma: " + data[0].customer.company.companyName+ " | Telefon: " + data[0].customer.phoneNumber+ " | Email: " + data[0].customer.email + " | Dodatkowe: " + data[0].customer.additionalInformation ;
			},
			null,
			() => {
				this.isDataFetchCompleteForBeforeOrderState = Promise.resolve(true);
				this.orderStateBeforeChange.orderTotalAmount /= 100;
				this.orderStateBeforeChange.cod /= 100;

				setTimeout(() => {

					this.additionalSaleCheckbox = this.orderStateBeforeChange.additionalSale == 1;
				}, 500);
			});

		orderService.getOrderStateFromHistoryByRevId(this.revIdOfOrderStateAfterChange).subscribe(
			data => {
				this.orderStateAfterChange = data[0];
				this.customerAfterDesc = data[0].customer.name + " | Firma: " + data[0].customer.company.companyName+ " | Telefon: " + data[0].customer.phoneNumber+ " | Email: " + data[0].customer.email + " | Dodatkowe: " + data[0].customer.additionalInformation ;
			},
			null,
			() => {
				this.isDataFetchCompleteForAfterOrderState = Promise.resolve(true);
				this.orderStateAfterChange.orderTotalAmount /= 100;
				this.orderStateBeforeChange.cod /= 100;

				setTimeout(() => {
					this.additionalSaleCheckboxForAfterOrderPanel = this.orderStateAfterChange.additionalSale == 1;
				}, 500);
			});

	}

	ngOnInit() {

	}

	getClassForCustomerDesc(): string{


		if(this.orderStateBeforeChange.customer.company.companyName === this.orderStateAfterChange.customer.company.companyName && this. orderStateBeforeChange.customer.name === this.orderStateAfterChange.customer.name) {
			return 'redcolor3'
		}else{
			return 'redcolor'
		}
		//|| (orderStateBeforeChange.customer.name === orderStateAfterChange.customer.name


	}

}
