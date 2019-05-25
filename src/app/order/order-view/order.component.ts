import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Order} from '../../model/order.model';
import {OrderService} from '../order.service';
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, DataTable, Dropdown, LazyLoadEvent, OverlayPanel, SelectItem} from "primeng/primeng";
import {AuthenticationService} from "../../authentication.service";
import {FileSendService} from "../../file-send/file-send.service";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {MenuItem} from "primeng/api";
import {File} from "../../model/file";
import {AppConstans} from "../../constans";
import {RoutingState} from "../../routing-stage";

@Component({
	selector: 'order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.css'],
	encapsulation: ViewEncapsulation.None
})

export class OrderComponent implements OnInit {
	public loading: boolean = false;
	public totalRecords: number;
	public orders: any[] = [];
	public ordersNotFiltered: any[] = [];
	public lastPaginationPageNumberOnOrderViewPage: number;
	public findInputTextOnOrderViewPage: string = "";
	public isCurrentPageCustomerEdit: boolean = false;
	public isCurrentPageOrdersView: boolean = false;
	public isCurrentPageOrdersViewRedirectedFromBasketStatitis: boolean = false;
	public showAttachmentModal: boolean = false;
	public showOrderPreviewModal: boolean = false;
	public currentCustomerOnCustomerEditPage: number;
	public printDeliveryConfirmationPdFSettings: boolean = false;
	public pdialogBasketProductsPrint: boolean = false;
	public selectedToPrintOrder: Order = new Order();
	public selectedOrderToPrintBasketProducts: any;
	public selectedToMenuOrder: number;
	public selectedOrdersMultiselction: Order[] = [];
	public orderStatusList: SelectItem[] = [];
	public ordersYears: SelectItem[] = [];
	public items: MenuItem[];
	public paginatorValues = AppConstans.PAGINATOR_VALUES;
	public additionalInforamtionTmp: string = "";
	fileFilterLoaded: Promise<boolean>;
	isOrderToShowFetchComplete: Promise<boolean>;
	isOrderToPrintProductOfBasketsFetchComplete: Promise<boolean>;
	public selectedOrderFileList: File[] = [];

	@ViewChild('onlyWithAttach') el: ElementRef;
	@ViewChild('statusFilter') statusFilterEl: Dropdown;
	@ViewChild('yearFilter') yearFilterEl: Dropdown;
	@ViewChild('dt') datatable: DataTable;
	@ViewChild('information_extention') information_extention: OverlayPanel;

	constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService, private router: Router, private confirmationService: ConfirmationService,
				private authenticationService: AuthenticationService, private  activedRoute: ActivatedRoute, private fileSendService: FileSendService,
				private  messageServiceExt: MessageServiceExt, private routingState: RoutingState) {

		this.setSearchOptions();
		this.isCurrentPageCustomerEdit = this.routingState.getCurrentPage().substring(0, 9) == "/customer";
		this.isCurrentPageOrdersView = this.routingState.getCurrentPage().substring(0, 7) == "/orders";
		this.isCurrentPageOrdersViewRedirectedFromBasketStatitis = this.routingState.getCurrentPage().substring(0, 10) == "/orders;id";

		if (this.isCurrentPageCustomerEdit) {
			orderService.getOrderByCustomer(activedRoute.snapshot.params["id"]).subscribe(data => {
				this.orders = data;
				this.ordersNotFiltered = data;
				this.currentCustomerOnCustomerEditPage = activedRoute.snapshot.params["id"];
			})
		} else if (this.isCurrentPageOrdersViewRedirectedFromBasketStatitis) {

			let basketIdTmp = activatedRoute.snapshot.paramMap.get('id');
			let startDateTmp = activatedRoute.snapshot.paramMap.get('startDate');
			let endDateTmp = activatedRoute.snapshot.paramMap.get('endDate');

			orderService.getOrdersByBasketIdAndOrderDateRange(basketIdTmp, startDateTmp, endDateTmp).subscribe(data => {
				this.orders = data;
				this.ordersNotFiltered = data;
			})

		} else {
			orderService.getOrdersDto(0, 50, "", "orderDate", 1, [], []).subscribe((data: any) => {
				this.orders = data.orderDtoList;
				this.totalRecords = data.totalRowsOfRequest;
			})
		}

	}

	ngOnInit() {

		this.getOrderStatusForDataTableFilter();
		this.getOrderYearsForDataTableFilter();

		this.items = [
			{
				label: 'Szybki podgląd zamówienia',
				icon: 'fa fa-search',
				command: () => this.showOrderPreview(event)
			},
			{
				label: 'Zmień status ', icon: 'fa fa-share',
				items: [

					{label: 'nowe', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(1)},
					{label: 'przyjęte', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(4)},
					{label: 'skompletowane', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(3)},
					{label: 'wysłane', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(2)},
					{label: 'zrealizowane', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(5)},
				]
			},
			{label: 'Pokaż załącznik(i)', icon: 'fa fa-paperclip', command: () => this.showAttachment()},
			{label: 'Wydrukuj', icon: 'fa fa-print', command: () => this.printMultiplePdf()},
			{
				label: 'Wydrukuj potwierdzenie',
				icon: 'fa fa-file-pdf-o',
				command: () => this.printMultipleDeliveryPdf()
			},
			{
				label: 'Wydrukuj komplet ', icon: 'fa fa-window-restore', command: () => {
					this.printMultipleDeliveryPdf();
					this.printMultiplePdf();
				}
			}
		];

	}

	private getOrderStatusForDataTableFilter() {
		this.orderService.getOrderStatus().subscribe(data => {
			data.forEach(value => {
				this.orderStatusList.push({label: '' + value.orderStatusName, value: value.orderStatusId});
			});
		});
	}

	private getOrderYearsForDataTableFilter() {
		this.orderService.getOrdersYears().subscribe((year: any) => {
			year.forEach(value => {
				this.ordersYears.push({label: '' + value, value: value});
			});
		});
	}

	setSearchOptions() {

		let previousUrlTmp = this.routingState.getPreviousUrl();

		if (previousUrlTmp.search('/order') == -1) {

			localStorage.removeItem('findInputTextOnOrderViewPage');
			localStorage.removeItem('lastPaginationPageNumberOnOrderViewPage');
		} else {
		}

		if (localStorage.getItem('findInputTextOnOrderViewPage')) {
			this.findInputTextOnOrderViewPage = (localStorage.getItem('findInputTextOnOrderViewPage'));
		} else {
			this.findInputTextOnOrderViewPage = "";
		}

		setTimeout(() => {
			if (localStorage.getItem('lastPaginationPageNumberOnOrderViewPage')) {
				let tmplastVisitedPage = parseInt(localStorage.getItem('lastPaginationPageNumberOnOrderViewPage'));
				this.lastPaginationPageNumberOnOrderViewPage = (tmplastVisitedPage - 1) * 50;
			} else {
				this.lastPaginationPageNumberOnOrderViewPage = 0;
			}
		}, 300);

	}

	refreshData() {

		this.loading = true;
		setTimeout(() => {
			if (this.isCurrentPageCustomerEdit) {
				this.orderService.getOrderByCustomer(this.currentCustomerOnCustomerEditPage).subscribe(data => this.orders = data);

			} else {
				this.orderService.getOrdersDto(0, 50, "", "orderDate", 1, [], []).subscribe((data: any) => {
					this.orders = data.orderDtoList;
					this.totalRecords = data.totalRowsOfRequest;
				});
			}

			this.loading = false;
		}, 1000);
	}

	showAttachment() {

		this.orderService.getFileList(this.selectedToMenuOrder).subscribe(data => {
			this.selectedOrderFileList = data;
			this.fileFilterLoaded = Promise.resolve(true);
		});
		this.showAttachmentModal = true;

	}

	showOrderPreview(event) {
		this.orderService.getOrder(event.data.orderId).subscribe(data => {
				this.selectedToPrintOrder = data;
			}
			, null
			, () => {

				this.isOrderToShowFetchComplete = Promise.resolve(true);
			});

		this.showOrderPreviewModal = true;
	}

	loadOrdersLazy(event: LazyLoadEvent) {

		this.loading = true;

		let pageNumber = 0;

		if (event.first) {  // in the beginning event.first is NaN so it's initiate by 0;
			pageNumber = event.first / event.rows;
		}

		console.log(event);

		let sortField = event.sortField;
		let orderStatusFilterList: any[] = [];
		let orderDataFilterList: any[] = [];

		if (sortField == undefined) {
			sortField = "orderDate";
		}

		if (event.filters != undefined && event.filters["orderStatus.orderStatusName"] != undefined) {
			orderStatusFilterList = event.filters["orderStatus.orderStatusName"].value;
		}

		if (event.filters != undefined && event.filters["orderDate"] != undefined) {
			orderDataFilterList = event.filters["orderDate"].value;
		}

		this.orderService.getOrdersDto(pageNumber, event.rows, event.globalFilter, sortField, event.sortOrder, orderStatusFilterList, orderDataFilterList).subscribe((data: any) => {
				this.orders = data.orderDtoList;
				this.totalRecords = data.totalRowsOfRequest;
			}, null
			, () => {
				this.loading = false;
			})
	}

	backToRegularOrderView() {
		this.isCurrentPageOrdersViewRedirectedFromBasketStatitis = false;

		this.refreshData();
	}

	backToBasketStatistic() {
		this.router.navigate(["/statistics/basket"]);
	}

	getFile(id: number) {
		this.fileSendService.getFile(id).subscribe(res => {
			let a = document.createElement("a");
			let blobURL = URL.createObjectURL(res);
			a.download = this.fileSendService.fileName;
			a.href = blobURL;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	}

	goToEditPage(index, id) {

		this.information_extention.hide();

		console.log((this.datatable.first / this.datatable.rows) + 1);
		let pageTmp = (this.datatable.first / this.datatable.rows) + 1;
		localStorage.setItem('lastPaginationPageNumberOnOrderViewPage', pageTmp.toString());
		let textTmp = this.findInputTextOnOrderViewPage;
		localStorage.setItem('findInputTextOnOrderViewPage', textTmp);
		this.router.navigate(["/order/", id]);
	}

	OnSelectRow(event) {

		this.selectedToMenuOrder = event.data.orderId;

	}

	printMultiplePdf() {

		let selectedOrdersIds: number[] = [];
		this.selectedOrdersMultiselction.forEach(order => {
			selectedOrdersIds.push(order.orderId);
		});

		this.orderService.getMultiplePdf(selectedOrdersIds).subscribe(res => {

			var fileURL = URL.createObjectURL(res);
			window.open(fileURL);
		})
	}

	printMultipleDeliveryPdf() {

		let selectedOrdersIds: number[] = [];
		this.selectedOrdersMultiselction.forEach(order => {
			selectedOrdersIds.push(order.orderId);
		})

		this.orderService.getMultipleConfirmationPdf(selectedOrdersIds).subscribe(res => {

			var fileURL = URL.createObjectURL(res);
			window.open(fileURL);
		})
	}

	changeOrderStatus(orderStatus: number) {
		this.orderService.changeOrderStatus(this.selectedToMenuOrder, orderStatus).subscribe(data => {
			this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono status zamówienia');
		}, error => {
			this.messageServiceExt.addMessage('error', 'Błąd ', error._body);

		});

		this.refreshData();
		setTimeout(() => {
			this.refreshData();
		}, 1000);
	}

	printPdf(id: number) {
		this.orderService.getPdf(id).subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);

			}
		)
	}

	printProductListPdf(id: number) {
		this.orderService.getProductListPdf(id).subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);

			}
		)
	}

	ShowConfirmModal(order: Order) {

		if (order.orderStatus.orderStatusId == 1) {

			this.confirmationService.confirm({
				message: 'Jesteś pewny że chcesz usunąć zamówienie nr:  ' + order.orderId + ' do kosza ?',
				accept: () => {
					order.orderStatus.orderStatusId = 99;

					this.orderService.saveOrder(order).subscribe(data => {

						this.refreshData();
					})

				},
				reject: () => {

				}
			});

		} else {
			this.confirmationService.confirm({
				message: 'Uwaga Jesteś pewny że chcesz trwale usunąć zamówienie nr:  ' + order.orderId + ' . Po tej operacji nie będzie możliwości odtworzenia danego zamówienia i jego pozycji',
				accept: () => {

					this.orderService.deleteOrder(order.orderId).subscribe(data => {

						this.refreshData();
					})

				},
				reject: () => {

				}
			});
		}

	}

	calculateStyles(a: any) {
		if (a == 'usunięte') {
			return {'color': 'red'};
		} else {
			return {'color': 'black'};
		}

	}

	clickOnlyWithAtttach() {

		if (this.el.nativeElement.checked) {

			let fillteredOrderList = this.orders.filter(function (data) {
				return data.dbFileId > 0;
			});
			this.orders = fillteredOrderList;

		} else {
			this.orders = this.ordersNotFiltered;
		}

	}

	rowExpand(event) {

		let index;
		this.orderService.getOrder(event.data.orderId).subscribe(data => {

			index = this.orders.findIndex((value: Order) => {
				return value.orderId == event.data.orderId;
			});

			this.orders[index].orderItems = data.orderItems;
		});

	}

	filterStatus(orderStatus: string) {

		this.yearFilterEl.value = 1111;
		this.yearFilterEl.selectedOption = {label: "wszystkie", value: 1111};

		if (orderStatus == 'wszystkie') {
			this.orders = this.ordersNotFiltered;

		} else {

			this.orders = this.ordersNotFiltered.filter((value: Order) => {
				return value.orderStatus.orderStatusName == orderStatus;
			});

		}

	}

	filterOrderYear(orderDate: number) {

		// this.statusFilterEl.value="wszystkie";
		// this.statusFilterEl.selectedOption = {label: "wszystkie", value: "wszystkie"};
		//
		// if (orderDate == 1111){
		//     this.orders = this.ordersNotFiltered;
		// }else{
		//
		//
		//
		//     this.orders = this.ordersNotFiltered.filter((value: Order) => {
		//
		//         return new Date(value.orderDate).getFullYear() == orderDate;
		//
		//     })
		// }

	}

	showPrintOrderDeliveryConfirmationWindows(orderId: number) {

		this.printDeliveryConfirmationPdFSettings = true;

		this.orderService.getOrder(orderId).subscribe(data => {
			this.selectedToPrintOrder = data;
		})

	}

	showPdialogBasketProductsPrint(orderId: number) {

		this.pdialogBasketProductsPrint = true;

		this.orderService.getOrder(orderId).subscribe(data => {
				this.selectedOrderToPrintBasketProducts = data;
			}, null,
			() => {
				this.selectedOrderToPrintBasketProducts.orderItems.forEach(orderItems => {
					orderItems.added = true;

				});
				console.log(this.selectedOrderToPrintBasketProducts);
				this.isOrderToPrintProductOfBasketsFetchComplete = Promise.resolve(true);

			})

	}

	printOrderBasketsProductsPdf() {

		this.orderService.getOrderBasketsProductsPdf(this.selectedOrderToPrintBasketProducts.orderItems).subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);
				this.pdialogBasketProductsPrint = false;

			}, error => {
				this.messageServiceExt.addMessage('error', 'Błąd przy generowaniu wydruku', "Status: " + error.status + ' ' + error.statusText);

			}
		)
	}

	ConfirmationPdf() {

		this.orderService.getConfirmationPdf(this.selectedToPrintOrder.orderId, this.selectedToPrintOrder.orderItems).subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);
				this.printDeliveryConfirmationPdFSettings = false;

			}, error => {
				this.messageServiceExt.addMessage('error', 'Błąd przy generowaniu wydruku', "Status: " + error.status + ' ' + error.statusText);

			}
		)
	}

	printConfirmationPdf() {

		this.orderService.getConfirmationPdf(this.selectedToPrintOrder.orderId, this.selectedToPrintOrder.orderItems).subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);
				this.printDeliveryConfirmationPdFSettings = false;

			}, error => {
				this.messageServiceExt.addMessage('error', 'Błąd przy generowaniu wydruku', "Status: " + error.status + ' ' + error.statusText);

			}
		)
	}

	isLongCell(textFromCell: string): boolean {

		if (textFromCell == null) {
			return false
		} else {
			return (textFromCell.length > 90);
		}

	}

	showAdditionalIInfExtension(event, additonalInformationText: string) {
		this.additionalInforamtionTmp = additonalInformationText;

		this.information_extention.toggle(event);

	}

}