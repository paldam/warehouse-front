import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
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
import {UserService} from "../../user.service";
import {User} from "../../model/user.model";
import {SpinerService} from "../../spiner.service";
import {BasketService} from "../../basket/basket.service";


@Component({
	selector: 'order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

	public selectedOrderFromRow: Order = new Order();
	public ORDER_STATUS_W_TRAKCIE_REALIZACJI = AppConstans.ORDER_STATUS_W_TRAKCIE_REALIZACJI;
	public loading: boolean = false;
	public totalRecords: number;
	public orders: any[] = [];
	public ordersNotFiltered: any[] = [];
	public lastPaginationPageNumberOnOrderViewPage: number;
	public findInputTextOnOrderViewPage: string = "";
	public isCurrentPageCustomerEdit: boolean = false;
	public isCurrentPageOrdersView: boolean = false;
	public isCurrentPageOrdersViewForProduction: boolean = false;
	public isCurrentPageOrdersViewRedirectedFromBasketStatitis: boolean = false;
	public showAttachmentModal: boolean = false;
	public showOrderPreviewModal: boolean = false;
	public currentCustomerOnCustomerEditPage: number;
	public printDeliveryConfirmationPdFSettings: boolean = false;
	public pdialogBasketProductsPrint: boolean = false;
	public selectedToPrintOrder: Order = new Order();
	public showImageFrame: boolean =false;
	public imageToShow: any;
	public selectedOrderToPrintBasketProducts: any;
	public selectedToMenuOrder: number;
	public selectedOrdersMultiselction: Order[] = [];
	public orderStatusList: SelectItem[] = [];
	public ordersYears: SelectItem[] = [];
	public items: MenuItem[];
	public productionUserList: any[] = [];
	public paginatorValues = AppConstans.PAGINATOR_VALUES;
	public additionalInforamtionTmp: string = "";
	public fileFilterLoaded: Promise<boolean>;
	public isOrderToShowFetchComplete: Promise<boolean>;
	public isOrderToPrintProductOfBasketsFetchComplete: Promise<boolean>;
	public selectedOrderFileList: File[] = [];
	public actionExtentionPositionTop: number = 0;
	public actionExtentionPositionLeft: number = 0;
	@ViewChild('onlyWithAttach') el: ElementRef;
	@ViewChild('action_extention') action_extention: ElementRef;
	@ViewChild('statusFilter') statusFilterEl: Dropdown;
	@ViewChild('yearFilter') yearFilterEl: Dropdown;
	@ViewChild('dt') datatable: DataTable;
	@ViewChild('information_extention') information_extention: OverlayPanel;

	constructor(private basketService :BasketService,private activatedRoute: ActivatedRoute, private orderService: OrderService, private userService: UserService, private router: Router, public confirmationService: ConfirmationService,
				public authenticationService: AuthenticationService, private fileSendService: FileSendService,
				private  messageServiceExt: MessageServiceExt, private routingState: RoutingState, private spinerService: SpinerService) {
		this.setCurentPageType();
		this.setSearchOptions();
		this.setOrderData();
	}

	ngOnInit() {
		this.getOrderStatusForDataTableFilter();
		this.getOrderYearsForDataTableFilter();
		this.getProductionUserForContextMenuSet();
	}

	@HostListener('window:resize', ['$event'])
	onWindowResize(event) {
		this.action_extention.nativeElement.hidden = true;
	}

	private setCurentPageType() {
		this.isCurrentPageCustomerEdit = this.routingState.getCurrentPage().substring(0, 9) == "/customer";
		this.isCurrentPageOrdersView = this.routingState.getCurrentPage().substring(0, 11) == "/orders/all";
		this.isCurrentPageOrdersViewRedirectedFromBasketStatitis = this.routingState.getCurrentPage().substring(0, 14) == "/orders/all;id";
		this.isCurrentPageOrdersViewForProduction = this.routingState.getCurrentPage().substring(0, 18) == "/orders/production";
	}

	private setOrderData() {
		if (this.isCurrentPageCustomerEdit) {
			this.performSetDataActionForCustomerEditPage();
		} else if (this.isCurrentPageOrdersViewRedirectedFromBasketStatitis) {
			this.performSetDataActionForOrderPageRedirectedFromStatistic();
		} else if (this.isCurrentPageOrdersViewForProduction) {
			this.performSetDataActionForOrderViewProduction();
		} else if (this.isCurrentPageOrdersView) {
			this.performSetDataActionForRegularOrderView();
		}
	}

	private performSetDataActionForRegularOrderView() {
		this.orderService.getOrdersDto(0, 50, "", "orderDate", 1, [], []).subscribe(
			(data: any) => {
				this.orders = data.orderDtoList;
				this.totalRecords = data.totalRowsOfRequest;
			}, error1 => {
			}, () => {
				this.calculateOrderProcessInPercentForStatusInProgress();
			})
	}


	private performSetDataActionForOrderViewProduction() {
		this.orderService.getOrdersDtoForProduction().subscribe(
			(data: any) => {
				this.orders = data;
			}, error1 => {
				this.spinerService.showSpinner = false;
			}, () => {
				this.calculateOrderProcessInPercentForStatusInProgress();
				this.spinerService.showSpinner = false;
			})
	}

	private performSetDataActionForOrderPageRedirectedFromStatistic() {
		let basketIdTmp = this.activatedRoute.snapshot.paramMap.get('id');
		let startDateTmp = this.activatedRoute.snapshot.paramMap.get('startDate');
		let endDateTmp = this.activatedRoute.snapshot.paramMap.get('endDate');
		this.orderService.getOrdersByBasketIdAndOrderDateRange(basketIdTmp, startDateTmp, endDateTmp).subscribe(data => {
			this.orders = data;
			this.ordersNotFiltered = data;
		}, error => {
		}, () => {
			this.calculateOrderProcessInPercentForStatusInProgress();
		})
	}

	private performSetDataActionForCustomerEditPage() {
		this.orderService.getOrderByCustomer(this.activatedRoute.snapshot.params["id"]).subscribe(data => {
				this.orders = data;
				this.ordersNotFiltered = data;
				this.currentCustomerOnCustomerEditPage = this.activatedRoute.snapshot.params["id"];
			}, error => {
			}
			, () => {
				this.calculateOrderProcessInPercentForStatusInProgress();
			}
		)
	}

	private calculateOrderProcessInPercentForStatusInProgress() {
		setTimeout(() => {
			this.orders.forEach(order => {
				if (order.orderStatus.orderStatusId == 6) {
					let totalBasketItem = 0;
					let totalComplete = 0;
					order.orderItems.forEach(orderItems => {
						totalBasketItem += orderItems.quantity;
						totalComplete = totalComplete + orderItems.stateOnLogistics + orderItems.stateOnProduction + orderItems.stateOnWarehouse;
					});
					order.progress = Math.floor(((totalComplete / 3) / totalBasketItem) * 100);
				}
			});
		}, 800);
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

	private getProductionUserForContextMenuSet() {
		this.userService.getAllProductionUsers().subscribe(data => {
			this.productionUserList = data;
		}, error => {
		}, () => this.setContextMenu());
	}

	refreshData() {
		let paginationPageTmp = this.datatable.first;
		this.lastPaginationPageNumberOnOrderViewPage = 0;
		this.action_extention.nativeElement.hidden = true;
		this.getProductionUserForContextMenuSet();
		this.spinerService.showSpinner = true;
		if (this.isCurrentPageCustomerEdit) {
			this.orderService.getOrderByCustomer(this.currentCustomerOnCustomerEditPage).subscribe(data => this.orders = data);
		}if(this.isCurrentPageOrdersViewForProduction){
			this.performSetDataActionForOrderViewProduction();
		}else {
			this.orderService.getOrdersDto(0, 50, "", "orderDate", 1, [], []).subscribe((data: any) => {
				this.orders = data.orderDtoList;
				this.totalRecords = data.totalRowsOfRequest;
			}, error => {
				this.spinerService.showSpinner = false;
			}, () => {
				setTimeout(() => {
					this.lastPaginationPageNumberOnOrderViewPage = paginationPageTmp;
				}, 50);
				setTimeout(() => {
					this.spinerService.showSpinner = false;
				}, 1000);
				this.calculateOrderProcessInPercentForStatusInProgress();
			});
		}
	}

	setSearchOptions() {
		let previousUrlTmp = this.routingState.getPreviousUrl();
		if (previousUrlTmp.search('/order') == -1) {
			localStorage.removeItem('findInputTextOnOrderViewPage');
			localStorage.removeItem('lastPaginationPageNumberOnOrderViewPage');
		}
		this.findInputTextOnOrderViewPage = localStorage.getItem('findInputTextOnOrderViewPage') ? (localStorage.getItem('findInputTextOnOrderViewPage')) : "";
		setTimeout(() => {
			if (localStorage.getItem('lastPaginationPageNumberOnOrderViewPage')) {
				let tmplastVisitedPage = parseInt(localStorage.getItem('lastPaginationPageNumberOnOrderViewPage'));
				this.lastPaginationPageNumberOnOrderViewPage = (tmplastVisitedPage - 1) * 50;
				console.log(this.lastPaginationPageNumberOnOrderViewPage);
			} else {
				this.lastPaginationPageNumberOnOrderViewPage = 0;
			}
		}, 300);
	}

	updateOrderProgress(order: Order) {
		this.orderService.changeOrderProgress(order.orderId, order.orderItems).subscribe(value => {
		}, error => {

		}, () => {
			this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono stan zamówienia');
			this.refreshData();
		});
	}
	
	test(event){
		console.log(event);
	}

	updateStateOnProduction(orderToChange, value,i:number){
		console.log(orderToChange );
		let orderLine = this.orders.find(order =>order.orderId == orderToChange.orderId);
		if (orderLine != undefined) {
			orderLine.orderItems[i].stateOnProduction = Number(value);
		}

	}

	updateStateOnWarehouse(orderToChange, value,i:number){
		let orderLine = this.orders.find(order =>order.orderId == orderToChange.orderId);
		if (orderLine != undefined) {
			orderLine.orderItems[i].stateOnWarehouse = Number(value);
		}
	}

	updateStateOnLogistics(orderToChange, value,i:number){
		let orderLine = this.orders.find(order =>order.orderId == orderToChange.orderId);
		if (orderLine != undefined) {
			orderLine.orderItems[i].stateOnLogistics = Number(value);
		}
	}

	showAttachment() {
		this.orderService.getFileList(this.selectedToMenuOrder).subscribe(data => {
			this.selectedOrderFileList = data;
			this.fileFilterLoaded = Promise.resolve(true);
		});
		this.showAttachmentModal = true;
	}

	hideActionExtention(event) {
		if (event.originalEvent.target.id != "action_extention_icon") this.action_extention.nativeElement.hidden = true;
	}

	hideActionExtention2(event) {
		this.action_extention.nativeElement.hidden = true;
	}

	showActionExtention(event) {
		this.action_extention.nativeElement.hidden = false;
		let el = event.srcElement;
		this.actionExtentionPositionLeft = el.getBoundingClientRect().x - 200;
		this.actionExtentionPositionTop = (el.getBoundingClientRect().y + window.scrollY) - 10;
	}

	showOrderPreview(event) {
		let orderIdTmp;
		orderIdTmp = (event instanceof MouseEvent) ? this.selectedOrderFromRow.orderId : event.data.orderId;
		this.orderService.getOrder(orderIdTmp).subscribe(data => {
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
		if (event.first) {
			pageNumber = event.first / event.rows;
		}
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
				this.calculateOrderProcessInPercentForStatusInProgress();
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

	getOrderFromRow(event) {
		this.selectedOrderFromRow = event.data;
	}

	goToEditPage(id) {
		if (this.authenticationService.isAdmin() || this.authenticationService.isBiuroUser()) {
			this.information_extention.hide();
			let pageTmp = (this.datatable.first / this.datatable.rows) + 1;
			localStorage.setItem('lastPaginationPageNumberOnOrderViewPage', pageTmp.toString());
			let textTmp = this.findInputTextOnOrderViewPage;
			localStorage.setItem('findInputTextOnOrderViewPage', textTmp);
			this.router.navigate(["/orders/", id]);
		}
	}

	OnSelectRow(event) {
		this.selectedOrderFromRow = event.data;
		this.action_extention.nativeElement.hidden = true;
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
 //TODO
	changeOrderStatus(orderStatus: number) {
		if (this.authenticationService.isProdukcjaUser()) {
			if (this.selectedOrderFromRow.orderStatus.orderStatusId == 1 || this.selectedOrderFromRow.orderStatus.orderStatusId == 4) {
				this.orderService.changeOrderStatus(this.selectedToMenuOrder, orderStatus).subscribe(data => {
					this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono status zamówienia');
				}, error => {
					this.messageServiceExt.addMessage('error', 'Błąd ', error._body);
				}, () => {
					this.refreshData();
				});

			}else{
				this.messageServiceExt.addMessage('error', 'Błąd ', 'Brak uprawnień');
			}
		} else {
			this.orderService.changeOrderStatus(this.selectedToMenuOrder, orderStatus).subscribe(data => {
				this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono status zamówienia');
			}, error => {
				this.messageServiceExt.addMessage('error', 'Błąd ', error._body);
			}, () => {
				this.refreshData();
			});
		}
	}



	printPdf(id: number) {
		this.orderService.getPdf(id).subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);
			}
		)
	}

	notAllowedStyle(): string {
		if (!this.authenticationService.isAdmin()) {
			return "not_allowed";
		}
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

	showBacketImg(event, basketId: number) {
		this.basketService.getBasketImg(basketId).subscribe(res => {
			this.createImageFromBlob(res);
		}, error => {
		}, complete => {
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

	clickOnlyWithAtttach() {
		this.action_extention.nativeElement.hidden = true;
		if (this.el.nativeElement.checked) {
			let fillteredOrderList = this.orders.filter(function (data) {
				return data.dbFileId > 0;
			});
			this.orders = fillteredOrderList;
		} else {
			this.orderService.getOrdersDto(0, 50, "", "orderDate", 1, [], []).subscribe((data: any) => {
				this.orders = data.orderDtoList;
				this.totalRecords = data.totalRowsOfRequest;
			})
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

	printProductListInBasketPdf(basketId: number){
		this.basketService.getBasketPdf(basketId).subscribe(res=>{
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);

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

	assignOrdersToSpecifiedProduction(productionId: number) {
		let orderIds = [];
		this.selectedOrdersMultiselction.forEach(order => {
			orderIds.push(order.orderId);
		});
		this.orderService.assignOrdersToSpecifiedProduction(orderIds, productionId).subscribe(
			value => {
				null
			}, error => {
				this.refreshData();
			}, () => {
				this.refreshData();
				this.messageServiceExt.addMessage('success', 'Status', 'Przydzielono produkcję do zamówienia');
			});
	}

	private setContextMenu() {
		let tmpLabel = [];
		this.productionUserList.forEach((user: User) => {
			tmpLabel.push({
				label: user.login,
				icon: 'fa fa-user-o',
				command: () => this.assignOrdersToSpecifiedProduction(user.id)
			})
		});


		if(this.authenticationService.isProdukcjaUser()){
			this.items = [
				{
					label: 'Szybki podgląd zamówienia',
					icon: 'fa fa-search',
					command: () => this.showOrderPreview(event)
				},
				{
					label: 'Zmień status ', icon: 'fa fa-share',
					items: [
						{label: 'przyjęte', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(4)},
						{label: 'nowe', icon: 'pi pi-fw pi-plus', command: () => this.changeOrderStatus(1)},
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
				},
			];

		}else{
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
				},
				{
					label: 'Przydziel zamówienie do ', icon: 'fa fa-hand-paper-o',
					items: tmpLabel
				},
			];
		}




	}
}