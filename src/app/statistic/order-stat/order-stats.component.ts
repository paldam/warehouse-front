import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Order} from '../../model/order.model';
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import {ConfirmationService, DataTable, Dropdown, OverlayPanel, SelectItem} from "primeng/primeng";
import {AuthenticationService} from "../../authentication.service";
import {filter, pairwise} from "rxjs/internal/operators";
import {FileSendService} from "../../file-send/file-send.service";
import {OrderItem} from "../../model/order_item";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {MenuItem} from "primeng/api";
import {File} from "../../model/file";
import * as XLSX from "xlsx";
import {OrderService} from "../../order/order.service";
import {AppConstants} from "../../constants";

@Component({
	selector: 'order-stats',
	templateUrl: './order-stats.component.html',
	styleUrls: ['./order-stats.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class OrderStatsComponent
	implements OnInit {
	public loading: boolean = false;
	public orders: any[] = [];
	public ordersNotFiltered: any[] = [];
	public lastVisitedPageOrder: number;
	public findInputtextOrder: string = "";
	public isCurrentPageCustomerEdit: boolean = false;
	public showAttachmentModal: boolean = false;
	public currentCustomerOnCustomerEditPage: number;
	public SelectedRowOrderItems: OrderItem[] = [];
	public printDeliveryConfirmationPdFSettings: boolean = false;
	public selectedToPrintOrder: Order = new Order();
	public selectedToMenuOrder: number;
	public selectedToPrintOrderItems: OrderItem[] = [];
	public selectedOrdersMultiselction: Order[] = [];
	public orderStatusList: SelectItem[];
	public items: MenuItem[];
	fileFilterLoaded: Promise<boolean>;
	public additionalInforamtionTmp: string = "";
	public selectedOrderFileList: File[] = [];
	@ViewChild('information_extention') information_extention: OverlayPanel;
	@ViewChild('onlyWithAttach') el: ElementRef;
	@ViewChild('statusFilter') statusFilterEl: Dropdown;
	@ViewChild('yearFilter') yearFilterEl: Dropdown;
	@ViewChild('dt') datatable: DataTable;
	public ordersYears: any[];
	public paginatorValues = AppConstants.PAGINATOR_VALUES;

	constructor(private orderService: OrderService, private router: Router, private confirmationService: ConfirmationService,
				private authenticationService: AuthenticationService, private  activeRoute: ActivatedRoute,
                private fileSendService: FileSendService,
				private  messageServiceExt: MessageServiceExt) {

		this.isCurrentPageCustomerEdit = router.url.substring(0, 9) == "/customer";
		if (this.isCurrentPageCustomerEdit) {
			orderService.getOrderByCustomer(activeRoute.snapshot.params["id"]).subscribe(data => {
				this.orders = data;
				this.ordersNotFiltered = data;
				this.currentCustomerOnCustomerEditPage = activeRoute.snapshot.params["id"];
			})
		} else {
			orderService.getOrderStats().subscribe(data => {
				this.orders = data;
				this.ordersNotFiltered = data;
			});
		}
		this.router.events
			.pipe(filter((e: any) => e instanceof RoutesRecognized),
				pairwise()
			).subscribe((e: any) => {
			let previousUrlTmp = e[0].urlAfterRedirects;
			if (previousUrlTmp.search('/order') == -1) {
				localStorage.removeItem('findInputtextOrder');
				localStorage.removeItem('lastPaginationPageNumberOnOrderViewPage');
			} else {
			}
		});
		if (localStorage.getItem('findInputtextOrder')) {
			this.findInputtextOrder = (localStorage.getItem('findInputtextOrder'));
		} else {
			this.findInputtextOrder = "";
		}
	}

	ngOnInit() {
		this.orderStatusList = [];
		this.orderStatusList.push({label: 'wszystkie', value: 'wszystkie'});
		this.orderStatusList.push({label: 'przyjęte', value: 'przyjęte'});
		this.orderStatusList.push({label: 'nowe', value: 'nowe'});
		this.orderStatusList.push({label: 'skompletowane', value: 'skompletowane'});
		this.orderStatusList.push({label: 'wysłane', value: 'wysłane'});
		this.orderStatusList.push({label: 'zrealizowane', value: 'zrealizowane'});
		this.ordersYears = [];
		this.ordersYears.push({label: 'wszystkie', value: 1111});
		this.ordersYears.push({label: '2017', value: 2017});
		this.ordersYears.push({label: '2018', value: 2018});
		this.ordersYears.push({label: '2019', value: 2019});
		setTimeout(() => {
			if (localStorage.getItem('lastPaginationPageNumberOnOrderViewPage')) {
				let tmplastVisitedPage = parseInt(localStorage.getItem('lastPaginationPageNumberOnOrderViewPage'));
				this.lastVisitedPageOrder = (tmplastVisitedPage - 1) * 20;
			} else {
				this.lastVisitedPageOrder = 0;
			}
		}, 300);
		this.items = [
			{
				label: 'Zmień status ', icon: 'fa fa-share',
				items: [
					{label: 'nowe', icon: 'pi pi-fw pi-plus', command: (event) => this.changeOrderStatus(1)},
					{label: 'przyjęte', icon: 'pi pi-fw pi-plus', command: (event) => this.changeOrderStatus(4)},
					{label: 'skompletowane', icon: 'pi pi-fw pi-plus', command: (event) => this.changeOrderStatus(3)},
					{label: 'wysłane', icon: 'pi pi-fw pi-plus', command: (event) => this.changeOrderStatus(2)},
					{label: 'zrealizowane', icon: 'pi pi-fw pi-plus', command: (event) => this.changeOrderStatus(5)},
				]
			},
			{label: 'Pokaż załącznik(i)', icon: 'fa fa-paperclip', command: (event) => this.showAttachment()},
			{label: 'Wydrukuj', icon: 'fa fa-print', command: (event) => this.printMultiplePdf()},
			{
				label: 'Wydrukuj potwierdzenie',
				icon: 'fa fa-file-pdf-o',
				command: (event) => this.printMultipleDeliveryPdf()
			},
			{
				label: 'Wydrukuj komplet ', icon: 'fa fa-window-restore', command: (event) => {
					this.printMultipleDeliveryPdf();
					this.printMultiplePdf();
				}
			}
		];
	}

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			if (this.isCurrentPageCustomerEdit) {
				this.orderService.getOrderByCustomer(this.currentCustomerOnCustomerEditPage).subscribe(data => this.orders = data);
			} else {
				this.orderService.getOrderStats().subscribe(data => this.orders = data);
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

	getFile(id: number) {
		this.fileSendService.getFile(id).subscribe(res => {
			let a = document.createElement("a")
			let blobURL = URL.createObjectURL(res);
			a.download = this.fileSendService.fileName;
			a.href = blobURL;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	}

	goToEditPage(index, id) {
		let pageTmp = ((index - 1) / 20) + 1;
		localStorage.setItem('lastPaginationPageNumberOnOrderViewPage', pageTmp.toString());
		let textTmp = this.findInputtextOrder;
		localStorage.setItem('findInputtextOrder', textTmp);
		this.router.navigate(["/orders/", id]);
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
			let fileURL = URL.createObjectURL(res);
			window.open(fileURL);
		})
	}

	printMultipleDeliveryPdf() {
		let selectedOrdersIds: number[] = [];
		this.selectedOrdersMultiselction.forEach(order => {
			selectedOrdersIds.push(order.orderId);
		});
		this.orderService.getMultipleConfirmationPdf(selectedOrdersIds).subscribe(res => {
			let fileURL = URL.createObjectURL(res);
			window.open(fileURL);
		})
	}

	changeOrderStatus(orderStatus: number) {
		this.orderService.changeOrderStatus(this.selectedToMenuOrder, orderStatus).subscribe(data => {
			this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono status zamówienia');
		}, error => {
			console.log(error);
			this.messageServiceExt.addMessage('error', 'Błąd ', error._body);
		});
		this.refreshData();
		setTimeout(() => {
			this.refreshData();
		}, 1000);
	}

	printPdf(id: number) {
		this.orderService.getPdf(id).subscribe(res => {
			let fileURL = URL.createObjectURL(res);
			window.open(fileURL);
			}
		)
	}

	printProductListPdf(id: number) {
		this.orderService.getProductListPdf(id).subscribe(res => {
			let fileURL = URL.createObjectURL(res);
			window.open(fileURL);
			}
		)
	}

	ShowConfirmModal(order: Order) {
		console.log(order.orderStatus.orderStatusId);
		if (order.orderStatus.orderStatusId == AppConstants.ORDER_STATUS_NOWE) {
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
			this.orders = this.orders.filter(function (data) {
				return data.dbFileId > 0;
			});
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

		this.statusFilterEl.value = "wszystkie";
		this.statusFilterEl.selectedOption = {label: "wszystkie", value: "wszystkie"};
		if (orderDate == 1111) {
			this.orders = this.ordersNotFiltered;
		} else {
			this.orders = this.ordersNotFiltered.filter((value: Order) => {
				return new Date(value.orderDate).getFullYear() == orderDate;
			})
		}
	}

	showPrintOrderDeliveryConfirmationWindows(orderId: number) {
		this.printDeliveryConfirmationPdFSettings = true;
		this.orderService.getOrder(orderId).subscribe(data => {
			this.selectedToPrintOrder = data;
		})
	}

	printConfirmationPdf() {
		this.orderService.getConfirmationPdf(this.selectedToPrintOrder.orderId, this.selectedToPrintOrder.orderItems)
            .subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);
				this.printDeliveryConfirmationPdFSettings = false;
			}, error => {
				this.messageServiceExt.addMessage('error', 'Błąd przy generowaniu wydruku', "Status: " + error.status
                    + ' ' + error.statusText);
			}
		)
	}

	generateXls() {
		let filt: any[] = [];
		if (!this.datatable.filteredValue) {
			filt = this.datatable.value;
		} else {
			filt = this.datatable.filteredValue;
		}
		let dataToGenerateFile: any[] = [];
		for (let i = 0; i < filt.length; i++) {
			let zestawy = "";
			let orderDateTmp = new Date(filt[i].orderDate);
			for (let n = 0; n < filt[i].orderItems.length; n++) {
				zestawy += filt[i].orderItems[n].basket.basketName;
				zestawy += " szt. " + filt[i].orderItems[n].quantity + " | ";
			}
			dataToGenerateFile[i] = {
				"Data Zamówienia": orderDateTmp.toLocaleDateString(),
				"Numer FV": filt[i].orderFvNumber,
				"Klient": filt[i].customer.name,
				"Data dostawy": filt[i].deliveryDate,
				"Typ Dostawy": filt[i].deliveryType.deliveryTypeName,
				"Wartość zamówienia": filt[i].orderTotalAmount / 100,
				"Wybrane zestawy": zestawy
			}
		}
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToGenerateFile);
		const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
		let today = new Date();
		let date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
		let fileName = "Zestawienie_" + date + ".xls";
		XLSX.writeFile(workbook, fileName, {bookType: 'xls', type: 'buffer'});
	}

	generateCustomerXls() {
		let filt: any[] = [];
		if (!this.datatable.filteredValue) {
			filt = this.datatable.value;
			console.log(filt);
		} else {
			filt = this.datatable.filteredValue;
			console.log(filt);
		}
		let dataToGenerateFile: any[] = [];
		for (let i = 0; i < filt.length; i++) {
			let zestawy = "";
			let orderDateTmp = new Date(filt[i].orderDate);
			let address = "";
			for (let n = 0; n < filt[i].orderItems.length; n++) {
				zestawy += filt[i].orderItems[n].basket.basketName;
				zestawy += " szt. " + filt[i].orderItems[n].quantity + " | ";
			}
			dataToGenerateFile[i] = {
				"Firma": filt[i].customer.company.companyName,
				"Nazwa Klienta": filt[i].customer.name,
				"Telefon": filt[i].customer.phoneNumber,
				"Email": filt[i].customer.email,
				"Wartość zamówienia": filt[i].orderTotalAmount / 100,
				"Data Zamówienia": orderDateTmp.toLocaleString(),
				"Uwagi": filt[i].additionalInformation,
				"Wybrane zestawy": zestawy
			}
		}
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToGenerateFile);
		const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
		let today = new Date();
		let date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
		let fileName = "Zestawienie_" + date + ".xls";
		XLSX.writeFile(workbook, fileName, {bookType: 'xls', type: 'buffer'});
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