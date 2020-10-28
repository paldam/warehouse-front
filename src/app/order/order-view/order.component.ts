import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Order} from '../../model/order.model';
import {OrderService} from '../order.service';
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, DataTable, Dropdown, LazyLoadEvent, OverlayPanel, SelectItem} from "primeng/primeng";
import {AuthenticationService} from "../../authentication.service";
import {FileSendService} from "../../file-send/file-send.service";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {MenuItem} from "primeng/api";
import {File} from "../../model/file";
import {AppConstants} from "../../constants";
import {RoutingState} from "../../routing-stage";
import {UserService} from "../../user.service";
import {User} from "../../model/user.model";
import {SpinerService} from "../../spiner.service";
import {BasketService} from "../../basket/basket.service";
import {OrderViewPageType} from "../order-view-page-type";
import * as XLSX from "xlsx";
import {OrderItem} from "../../model/order_item";
import {interval, Subscription} from 'rxjs';
import {NotificationsService} from "../../nav-bars/top-nav/notification.service";
import {ServerSideEventsService} from "../../server-side-events-service";
import {Notification} from "../../model/notification";
import {Supplier} from "../../model/supplier.model";

@Component({
	selector: 'order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.css']
})
export class OrderComponent
	implements OnInit,
			   OnDestroy {
	public pageType: OrderViewPageType;
	public selectedOrderFromRow: Order = new Order();
	public ORDER_STATUS_W_TRAKCIE_REALIZACJI = AppConstants.ORDER_STATUS_W_TRAKCIE_REALIZACJI;
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
	public showImageFrame: boolean = false;
	public imageToShow: any;
	public selectedOrderToPrintBasketProducts: any;
	public selectedToMenuOrder: number;
	public selectedOrdersMultiselction: Order[] = [];
	public orderStatusList: SelectItem[] = [];
	public deliveryTypesList: SelectItem[] = [];
	public weeksList: SelectItem[] = [];
	public ordersYears: SelectItem[] = [];
	public items: MenuItem[];
	public exportItems: MenuItem[];
	public productionUserList: any[] = [];
	public productionUserListSelectItem: SelectItem[] = [];
	public editCurrentOrderStateDialog: boolean = false;
	public orderItemRowToEditState: OrderItem = new OrderItem();
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	public additionalInforamtionTmp: string = "";
	public fileFilterLoaded: Promise<boolean>;
	public isOrderToShowFetchComplete: Promise<boolean>;
	public isOrderToPrintProductOfBasketsFetchComplete: Promise<boolean>;
	public selectedOrderFileList: File[] = [];
	public actionExtentionPositionTop: number = 0;
	public actionExtentionPositionLeft: number = 0;
	public expandedRowOrderId: number = 0;
	public autoRefreshInfo: boolean = false;
	public autoRefreshTimerInSec: number;
	public autoRefreshStopWatch: boolean = false;
	public deleteOrderPanelVisi: boolean = false;
	public intervalsubscription: Subscription;
	public orderToDelete: Order;
	public showNotificationModal: boolean = false;
	public notifications: Notification[] = [];
	public notificationsTotal: number = 0;

	public selectedProvinces: String[] = [];
	public provinces: SelectItem[] = [];


	@ViewChild('onlyWithAttach') el: ElementRef;
	@ViewChild('action_extention') action_extention: ElementRef;
	@ViewChild('statusFilter') statusFilterEl: Dropdown;
	@ViewChild('yearFilter') yearFilterEl: Dropdown;
	@ViewChild('dt') datatable: DataTable;
	@ViewChild('information_extention') information_extention: OverlayPanel;

	constructor(private basketService: BasketService, private activatedRoute: ActivatedRoute,
				private orderService: OrderService, private userService: UserService, private router: Router,
				public confirmationService: ConfirmationService, public authenticationService: AuthenticationService,
				private fileSendService: FileSendService, private serverSideEventsService: ServerSideEventsService,
				private  messageServiceExt: MessageServiceExt, private routingState: RoutingState,
				private spinerService: SpinerService, public notificationsService: NotificationsService) {
		this.setCurentPageType();
		this.setSearchOptions();
		this.setOrderData();
	}

	ngOnDestroy() {
		this.serverSideEventsService.newOrderEventSource.close();
		this.serverSideEventsService.orderCopyEventSource.close();
	}

	ngOnInit() {
		this.getOrderStatusForDataTableFilter();
		this.getWeeksForDataTableFilter();
		this.getProvincesForDataTableFilter();
		this.getProductionUserForDataTableFilter();
		this.getOrderYearsForDataTableFilter();
		this.getDeliveryTypeForDataTableFilter();
		this.getProductionUserForContextMenuSet();
		this.setExportMenu();
		this.notificationsService.checkNumberOfNotifications();
		setTimeout(() => {
			this.setEventSources();
		}, 1000);
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

		setTimeout(() => {
			this.datatable.lazy = true;
		}, 500);
		this.orderService.getOrdersDto(0, 50, "", "orderDate", 1, [], [],[],[],[],[]).subscribe(
			(data: any) => {
				this.orders = data.orderDtoList;
				this.totalRecords = data.totalRowsOfRequest;
			}, error1 => {
			}, () => {
				this.calculateOrderProcessInPercentForStatusInProgress();
			});
	}

	private performSetDataActionForOrderViewProduction() {
		this.orderService.getOrdersDtoForProduction().subscribe(
			(data: any) => {
				this.orders = data;
			}, error1 => {
				this.spinerService.showSpinner = false;
			}, () => {
				this.expandRowAfterRefresh();
				this.calculateOrderProcessInPercentForStatusInProgress();
				setTimeout(() => {
					this.spinerService.showSpinner = false;
				}, 1000);
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
				if (order.orderStatus.orderStatusId == this.ORDER_STATUS_W_TRAKCIE_REALIZACJI) {
					let totalBasketItem = 0;
					let totalComplete = 0;
					order.orderItems.forEach(orderItems => {
						totalBasketItem += orderItems.quantity;
						totalComplete = totalComplete + orderItems.stateOnLogistics + orderItems.stateOnProduction +
							orderItems.stateOnWarehouse;
					});
					order.progress = Math.floor(((totalComplete / 3) / totalBasketItem) * 100);

				}
			});
		}, 800);
	}

	setEventSources() {
		this.serverSideEventsService.renew();
		this.serverSideEventsService.newOrderEventSource.addEventListener('message', (message: any) => {
			if (this.authenticationService.isMagazynUser() || this.authenticationService.isWysylkaUser()
				|| message.data == this.authenticationService.getCurrentUser()) {
				this.messageServiceExt.addMessageWithTime('success', 'Informacja', 'Dodano nowe zamówienie(a)', 15000);
			}
		});
		this.serverSideEventsService.renewOrderCopy();
		this.serverSideEventsService.orderCopyEventSource.addEventListener('message', (message: any) => {
			if (this.authenticationService.isProdukcjaUser() || this.authenticationService.isMagazynUser() ||
				this.authenticationService.isWysylkaUser() || message.data == this.authenticationService.getCurrentUser()) {
				this.notificationsService.checkNumberOfNotifications();
			}
		});
	}

	private getOrderStatusForDataTableFilter() {
		this.orderService.getOrderStatus().subscribe(data => {
			data.forEach(value => {
				this.orderStatusList.push({label: '' + value.orderStatusName, value: value.orderStatusId});
			});
		});
	}

	private getDeliveryTypeForDataTableFilter() {
		this.orderService.getDeliveryTypes().subscribe(data => {
			data.forEach(value => {
				this.deliveryTypesList.push({label: '' + value.deliveryTypeName, value: value.deliveryTypeId});
			});
		});
	}

	private getProductionUserForDataTableFilter() {
		this.userService.getAllProductionUsers().subscribe(data => {
			data.forEach(value => {
				this.productionUserListSelectItem.push({label: '' + value.login, value: value.id});
			});
		});
	}


	private getWeeksForDataTableFilter() {
		for (let i = 1; i < 53; i++) {
			this.weeksList.push({label: '' + i, value: i});
		}

	}


	private getProvincesForDataTableFilter(){
		this.provinces = [
			{label: 'Mazowieckie', value: 'Mazowieckie'},
			{label: 'Dolnośląskie', value: 'Dolnośląskie'},
			{label: 'Kujawsko-Pomorskie', value: 'Kujawsko-Pomorskie'},
			{label: 'Lubelskie', value: 'Lubelskie'},
			{label: 'Lubuskie', value: 'Lubuskie'},
			{label: 'Łódzkie', value: 'Łódzkie'},
			{label: 'Małopolskie', value: 'Małopolskie'},
			{label: 'Opolskie', value: 'Opolskie'},
			{label: 'Podkarpackie', value: 'Podkarpackie'},
			{label: 'Podlaskie', value: 'Podlaskie'},
			{label: 'Pomorskie', value: 'Pomorskie'},
			{label: 'Śląskie', value: 'Śląskie'},
			{label: 'Świętokrzyskie', value: 'Świętokrzyskie'},
			{label: 'Warmińsko-Mazurskie', value: 'Warmińsko-Mazurskie'},
			{label: 'Wielkopolskie', value: 'Wielkopolskie'},
			{label: 'Zachodniopomorskie', value: 'Zachodniopomorskie'},

		];
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

	setSearchOptions() {
		let previousUrlTmp = this.routingState.getPreviousUrl();
		if (previousUrlTmp.search('/order') == -1) {
			localStorage.removeItem('findInputTextOnOrderViewPage');
			localStorage.removeItem('lastPaginationPageNumberOnOrderViewPage');
		}
		this.findInputTextOnOrderViewPage = localStorage.getItem('findInputTextOnOrderViewPage') ?
			(localStorage.getItem('findInputTextOnOrderViewPage')) : "";
		setTimeout(() => {
			if (localStorage.getItem('lastPaginationPageNumberOnOrderViewPage')) {
				let tmplastVisitedPage = parseInt(localStorage.getItem('lastPaginationPageNumberOnOrderViewPage'));
				this.lastPaginationPageNumberOnOrderViewPage = (tmplastVisitedPage - 1) * 50;
			} else {
				this.lastPaginationPageNumberOnOrderViewPage = 0;
			}
		}, 300);
	}

	updateOrderProgress(order: Order) {
		let orderTmp: Order = this.orders.find(data => data.orderId == order.orderId);
		this.orderService.changeOrderProgress(orderTmp.orderId, orderTmp.orderItems).subscribe(value => {
		}, error => {
			let orderTmp: Order;
			this.orderService.getOrder(order.orderId).subscribe(data => {
				orderTmp = data;
			}, error => {
			}, () => {
				let orderIndex = this.orders.findIndex(data => data.orderId == order.orderId);
				if (orderIndex == -1) {
				} else {
					this.orders[orderIndex].orderItems = orderTmp.orderItems;
				}
			});
		}, () => {
			this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono stan zamówienia');
			this.refreshData();
		});
	}

	updateStateOnProduction(orderToChange, value, i: number) {
		let orderLine = this.orders.find(order => order.orderId == orderToChange.orderId);
		if (orderLine != undefined) {
			orderLine.orderItems[i].stateOnProduction = Number(value);
		}
	}

	updateStateOnWarehouse(orderToChange, value, i: number) {
		let orderLine = this.orders.find(order => order.orderId == orderToChange.orderId);
		if (orderLine != undefined) {
			orderLine.orderItems[i].stateOnWarehouse = Number(value);
		}
	}

	updateStateOnLogistics(orderToChange, value, i: number) {
		let orderLine = this.orders.find(order => order.orderId == orderToChange.orderId);
		if (orderLine != undefined) {
			orderLine.orderItems[i].stateOnLogistics = Number(value);
		}
	}

	isProductionInputDisable(orderStatusId: number, quantityFromSurplus: number): boolean {
		if (quantityFromSurplus > 0) {
			return true;
		}
		if (this.isCurrentPageOrdersViewRedirectedFromBasketStatitis || this.isCurrentPageCustomerEdit) {
			return true;
		}
		if (orderStatusId != this.ORDER_STATUS_W_TRAKCIE_REALIZACJI) {
			return true;
		} else {
			return !(this.authenticationService.isProdukcjaUser() || this.authenticationService.isAdmin());
		}
	}

	isMagazynInputDisable(orderStatusId: number, quantityFromSurplus: number): boolean {
		if (quantityFromSurplus > 0) {
			return true;
		}
		if (this.isCurrentPageOrdersViewRedirectedFromBasketStatitis || this.isCurrentPageCustomerEdit) {
			return true;
		} else if (orderStatusId != this.ORDER_STATUS_W_TRAKCIE_REALIZACJI) {
			return true;
		} else {
			if (this.authenticationService.isMagazynUser() || this.authenticationService.isAdmin()) {
				return false
			} else {
				return true;
			}
		}
	}

	isWysylkaInputDisable(orderStatusId: number): boolean {
		if (this.isCurrentPageOrdersViewRedirectedFromBasketStatitis || this.isCurrentPageCustomerEdit) {
			return true;
		}
		if (orderStatusId != this.ORDER_STATUS_W_TRAKCIE_REALIZACJI) {
			return true;
		} else {
			if (this.authenticationService.isWysylkaUser() || this.authenticationService.isAdmin()) {
				return false
			} else {
				return true;
			}
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

	showEditCurrentOrderStateDialog(o: Order, row) {
		this.orderItemRowToEditState = row;
		let index = this.orders.findIndex(data => data.orderId == o.orderId);
		this.editCurrentOrderStateDialog = true;
	}

	hideAutoRefreshInfo() {
		this.autoRefreshInfo = false;
	}

	autoRefreshCountDown() {
		this.autoRefreshStopWatch = false;
		this.autoRefreshTimerInSec = 5;
		const subscription = interval(1000).subscribe(x => {
			this.autoRefreshTimerInSec -= 1;
		});
		setTimeout(() => {
			subscription.unsubscribe();
			this.autoRefreshInfo = false;
			if (this.autoRefreshStopWatch == false) {
				this.refreshData();
			}
		}, 5000);
	}

	stopAutoRefresh() {
		this.autoRefreshStopWatch = true;
	}

	setAutoRefresh(setTimeOutInMinute: number) {
		let timeOut = setTimeOutInMinute * 1000 * 60;
		this.intervalsubscription = interval(timeOut).subscribe(x => {
			this.autoRefreshInfo = true;
			this.autoRefreshCountDown();
		});
	}

	backToRegularOrderView() {
		this.router.navigate(["/orders/all"]);
		this.isCurrentPageOrdersViewRedirectedFromBasketStatitis = false;
		this.isCurrentPageOrdersView = true;
		this.setSearchOptions();
		this.setOrderData();
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

	markAsReadyForLoyaltyProgram() {
		let selectedOrdersIds: number[] = [];
		this.selectedOrdersMultiselction.forEach(order => {
			selectedOrdersIds.push(order.orderId);
		})
		this.orderService.getMultipleConfirmationPdf(selectedOrdersIds).subscribe(res => {
			var fileURL = URL.createObjectURL(res);
			window.open(fileURL);
		})
	}

	changePaymentStatus(status: number) {

		this.orderService.changePaymentStatus(this.selectedToMenuOrder,status).subscribe(data => {
			this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono status płatnosci');
		}, error => {
			this.messageServiceExt.addMessage('error', 'Błąd ', error._body);
		}, () => {
			this.refreshData();
		});

	}


	changeOrderStatus(orderStatus: number) {
		if (this.authenticationService.isProdukcjaUser()) {
			if (this.selectedOrderFromRow.orderStatus == AppConstants.ORDER_STATUS_NOWE ||
				this.selectedOrderFromRow.orderStatus.orderStatusId == this.ORDER_STATUS_W_TRAKCIE_REALIZACJI) {
				this.orderService.changeOrderStatus(this.selectedToMenuOrder, orderStatus).subscribe(data => {
					this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono status zamówienia');
				}, error => {
					this.messageServiceExt.addMessage('error', 'Błąd ', error._body);
				}, () => {
					this.refreshData();
				});
			} else {
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

	changeOrderStatusToInProgress(order: any) {
		this.orderService.changeOrderStatus(order.orderId, 6).subscribe(data => {
			this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono status zamówienia');
		}, error => {
			this.messageServiceExt.addMessage('error', 'Błąd ', error._body);
		}, () => {
			this.refreshData();
		});
	}

	getBadgeStyle(): string {
		if (this.notificationsService.notificationsTotal == 0) {
			return "badge"
		} else if (this.notificationsService.notificationsTotal <= 9) {
			return "badge1";
		} else if (this.notificationsService.notificationsTotal > 9)
			return "badge2";
	}

	refreshData() {
		this.notificationsService.checkNumberOfNotifications();
		let paginationPageTmp = this.datatable.first;
		this.lastPaginationPageNumberOnOrderViewPage = 0;
		this.action_extention.nativeElement.hidden = true;
		this.getProductionUserForContextMenuSet();
		this.spinerService.showSpinner = true;
		if (this.isCurrentPageCustomerEdit) {
			this.orderService.getOrderByCustomer(this.currentCustomerOnCustomerEditPage).subscribe(data => this.orders = data);
		}
		if (this.isCurrentPageOrdersViewForProduction) {
			this.performSetDataActionForOrderViewProduction();
		} else {
			this.orderService.getOrdersDto(0, 50, "", "orderDate", 1, [], [],[],[],[],[]).subscribe((data: any) => {
				this.orders = data.orderDtoList;
				this.totalRecords = data.totalRowsOfRequest;
			}, error => {
				this.spinerService.showSpinner = false;
			}, () => {
				this.calculateOrderProcessInPercentForStatusInProgress();
				setTimeout(() => {
					this.lastPaginationPageNumberOnOrderViewPage = paginationPageTmp;
				}, 50);

				setTimeout(() => {
					this.expandRowAfterRefresh();
					this.spinerService.showSpinner = false;
				}, 1000);

			});
		}
	}

	filterByProvince(){
		this.loadOrdersLazy(this.datatable.createLazyLoadMetadata());
	}

	loadOrdersLazy(event: LazyLoadEvent) {

		this.loading = true;
		let pageNumber = 0;
		if (event.first) {
			pageNumber = event.first / event.rows;
		}
		let sortField = event.sortField;
		let orderStatusFilterList: any[] = [];
		let deliveryTypeFilterList: any[] = [];


		let orderDataFilterList: any[] = [];
		let orderProductionUserFilterList: any[] = [];
		let orderWeeksFilterList: any[] = [];

		if (sortField == undefined) {
			sortField = "orderDate";
		}
		if (event.filters != undefined && event.filters["orderStatus.orderStatusName"] != undefined) {
			orderStatusFilterList = event.filters["orderStatus.orderStatusName"].value;
		}

		if (event.filters != undefined && event.filters["deliveryType.deliveryTypeName"] != undefined) {
			deliveryTypeFilterList = event.filters["deliveryType.deliveryTypeName"].value;
		}

		if (event.filters != undefined && event.filters["orderDate"] != undefined) {
			orderDataFilterList = event.filters["orderDate"].value;
		}
		if (event.filters["productionUser.login"] != undefined) {
			orderProductionUserFilterList = event.filters["productionUser.login"].value;
		}

		if (event.filters["weekOfYear"] != undefined) {
			orderWeeksFilterList = event.filters["weekOfYear"].value;
		}


		
		
		this.orderService.getOrdersDto(
			pageNumber, event.rows, event.globalFilter, sortField, event.sortOrder, orderStatusFilterList, orderDataFilterList,orderProductionUserFilterList,orderWeeksFilterList,this.selectedProvinces,deliveryTypeFilterList)
			.subscribe((data: any) => {
					this.orders = data.orderDtoList;
					this.totalRecords = data.totalRowsOfRequest;
				}, null
				, () => {
					this.loading = false;
					this.calculateOrderProcessInPercentForStatusInProgress();
					if (this.expandedRowOrderId != 0) {
						this.expandRowAfterRefresh();
					}
				})
	}

	rowExpand(event) {
		if (event.data) {
			this.expandedRowOrderId = event.data.orderId;
			let index;
			let dataTmp;
			this.orderService.getOrder(event.data.orderId).subscribe(data => {
				index = this.orders.findIndex((value: Order) => {
					return value.orderId == event.data.orderId;
				});
				dataTmp = data;
				this.orders[index] = dataTmp;
				console.log(this.orders[index]);
				console.log(dataTmp);
			});
		}
	}

	onRowCollapse(event) {
		console.log("RowCollapse");
		if (this.datatable.first == 0) {
			this.expandedRowOrderId = 0;
		}
	}

	updateSpecifiedOrderItemProgressOnWarehouse(orderItemId: number, newStateValueOnWarehouse: number) {
		this.orderService.changeSpecifiedOrderItemProgressOnWarehouse(orderItemId, newStateValueOnWarehouse)
			.subscribe(data => {
				this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono ilość gotowych koszy');
			}, error => {
				this.editCurrentOrderStateDialog = false;
				this.refreshData();
			}, () => {
				this.editCurrentOrderStateDialog = false;
				this.orderItemRowToEditState = new OrderItem();
				this.refreshData();
			})
	}

	updateSpecifiedOrderItemProgressOnProduction(orderItemId: number, newStateValueOnWarehouse: number) {
		this.orderService.changeSpecifiedOrderItemProgressOnProduction(orderItemId, newStateValueOnWarehouse)
			.subscribe(data => {
				this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono ilość gotowych koszy');
			}, error => {
				this.editCurrentOrderStateDialog = false;
				this.refreshData();
			}, () => {
				this.editCurrentOrderStateDialog = false;
				this.orderItemRowToEditState = new OrderItem();
				this.refreshData();
			})
	}

	updateSpecifiedOrderItemProgressOnLogistics(orderItemId: number, newStateValueOnWarehouse: number) {
		this.orderService.changeSpecifiedOrderItemProgressOnLogistics(orderItemId, newStateValueOnWarehouse)
			.subscribe(data => {
				this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono ilość gotowych koszy');
			}, error => {
				this.editCurrentOrderStateDialog = false;
				this.refreshData();
			}, () => {
				this.editCurrentOrderStateDialog = false;
				this.orderItemRowToEditState = new OrderItem();
				this.refreshData();
			})
	}

	updateSpecifiedOrderItemProgressOnWarehouseByAddValue(orderItemId: number, newStateValueToAddOnWarehouse: number) {
		if (newStateValueToAddOnWarehouse) {
			this.orderService
				.changeSpecifiedOrderItemProgressOnWarehouseByAddValue(orderItemId, newStateValueToAddOnWarehouse)
				.subscribe(data => {
					this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono ilość gotowych koszy');
				}, error => {
				}, () => {
					this.editCurrentOrderStateDialog = false;
					this.orderItemRowToEditState = new OrderItem();
					this.refreshData();
				})
		}
	}

	updateSpecifiedOrderItemProgressOnProductionByAddValue(orderItemId: number, newStateValueToAddOnWarehouse: number) {
		if (newStateValueToAddOnWarehouse) {
			this.orderService
				.changeSpecifiedOrderItemProgressOnProductionByAddValue(orderItemId, newStateValueToAddOnWarehouse)
				.subscribe(data => {
					this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono ilość gotowych koszy');
				}, error => {
				}, () => {
					this.editCurrentOrderStateDialog = false;
					this.orderItemRowToEditState = new OrderItem();
					this.refreshData();
				})
		}
	}

	updateSpecifiedOrderItemProgressOnLogisticsByAddValue(orderItemId: number, newStateValueToAddOnLogistics: number) {
		if (newStateValueToAddOnLogistics) {
			this.orderService
				.changeSpecifiedOrderItemProgressOnLogisticsByAddValue(orderItemId, newStateValueToAddOnLogistics)
				.subscribe(data => {
					this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono ilość gotowych koszy');
				}, error => {
				}, () => {
					this.editCurrentOrderStateDialog = false;
					this.orderItemRowToEditState = new OrderItem();
					this.refreshData();
				})
		}
	}

	private expandRowAfterRefresh() {
		let index = this.orders.findIndex(value => value.orderId == this.expandedRowOrderId);
		if (this.expandedRowOrderId != 0) {
			this.datatable.toggleRow(this.orders[index]);
		}
	}

	openRow(op: number, notifyId: number) {
		this.notificationsService.showNotificationModal = false;
		let index = this.orders.findIndex(value => value.orderId == op);
		this.datatable.toggleRow(this.orders[index]);
		this.orderService.markNotifyAsReaded(notifyId).subscribe(value => {
		}, error1 => {
			this.notificationsService.checkNumberOfNotifications();
		}, () => {
			this.notificationsService.checkNumberOfNotifications();
		});
	}

	markReadedAll() {
		this.orderService.markNotifyAsReaded(0).subscribe(value => {
		}, error1 => {
			this.notificationsService.showNotificationModal = false;
			this.notificationsService.checkNumberOfNotifications();
		}, () => {
			this.notificationsService.showNotificationModal = false;
			this.notificationsService.checkNumberOfNotifications();
		});
	}

	printPdf(id: number) {
		this.orderService.getPdf(id).subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);
			}
		)
	}

	printAllTotayPdf() {
		this.orderService.getAllTodayPdf().subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);
			}, error => {
				this.messageServiceExt.addMessage('error', 'Status', 'Brak zamówień z tego dnia');
			}
		)
	}

	showDeleteOrderPanel(order: Order) {
		this.deleteOrderPanelVisi = true;
		this.orderService.getOrder(order.orderId).subscribe(order => {
				this.orderToDelete = order;
			}, error1 => {
			}, () => {
				this.orderToDelete.orderItems.forEach(oi => {
					oi.stateOnWarehouse = oi.stateOnWarehouse - oi.stateOnProduction;
				})
			}
		);
	}

	cancelOrder(order: Order) {
		this.orderService.cancelOrder(order).subscribe(value => {
		}, error1 => {
			this.messageServiceExt.addMessage('error', 'Status', 'Błąd');
			this.deleteOrderPanelVisi = false;
		}, () => {
			this.deleteOrderPanelVisi = false;
			this.messageServiceExt.addMessage('success', 'Status', 'Anulowano zamówienie');
			this.refreshData();
		})
	}

	notAllowedStyle(): string {
		if (!(this.authenticationService.isAdmin() || this.authenticationService.isBiuroUser())) {
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
				message: 'Uwaga Jesteś pewny że chcesz trwale usunąć zamówienie nr:  ' + order.orderId +
					' . Po tej operacji nie będzie możliwości odtworzenia danego zamówienia i jego pozycji',
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

	calculatePaymantInfoStyles(a: any) {
		if (a == 0) {
			return {'color': 'red'};
		} else {
			return {'color': 'green'};
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
			this.orderService.getOrdersDto(0, 50, "", "orderDate", 1, [], [],[],[],[],[]).subscribe((data: any) => {
				this.orders = data.orderDtoList;
				this.totalRecords = data.totalRowsOfRequest;
			})
		}
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
		this.orderService.getOrderBasketsProductsPdf(
			this.selectedOrderToPrintBasketProducts.orderItems, this.selectedOrderToPrintBasketProducts.orderId)
			.subscribe(res => {
					if (this.authenticationService.isAdmin() || this.authenticationService.isProdukcjaUser()) {
						this.changeOrderStatusToInProgress(this.selectedOrderToPrintBasketProducts);
					}
					var fileURL = URL.createObjectURL(res);
					window.open(fileURL);
					this.pdialogBasketProductsPrint = false;
				}, error => {
					this.messageServiceExt.addMessage('error', 'Błąd przy generowaniu wydruku', "Status: "
						+ error.status + ' ' + error.statusText);
				}
			)
	}

	ConfirmationPdf() {
		this.orderService.getConfirmationPdf(this.selectedToPrintOrder.orderId, this.selectedToPrintOrder.orderItems)
			.subscribe(res => {
					var fileURL = URL.createObjectURL(res);
					window.open(fileURL);
					this.printDeliveryConfirmationPdFSettings = false;
				}, error => {
					this.messageServiceExt.addMessage('error', 'Błąd przy generowaniu wydruku', "Status: "
						+ error.status + ' ' + error.statusText);
				}
			)
	}

	printProductListInBasketPdf(basketId: number) {
		this.basketService.getBasketPdf(basketId).subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);
			}
		)
	}

	printConfirmationPdf() {
		this.orderService.getConfirmationPdf(this.selectedToPrintOrder.orderId, this.selectedToPrintOrder.orderItems)
			.subscribe(res => {
					var fileURL = URL.createObjectURL(res);
					window.open(fileURL);
					this.printDeliveryConfirmationPdFSettings = false;
				}, error => {
					this.messageServiceExt.addMessage('error', 'Błąd przy generowaniu wydruku', "Status: " + error.status +
						' ' + error.statusText);
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

	lookupRowStyleClass(rowData: Notification): string {
		return rowData.wasRead ? '' : 'notification-bold';
	}

	markAsReadyToProgram() {
		let orderIds = [];
		this.selectedOrdersMultiselction.forEach(order => {
			orderIds.push(order.orderId);
		});
		this.orderService.markAsReadyToProgram(orderIds).subscribe(
			value => {
				null
			}, error => {
				this.refreshData();
			}, () => {
				this.refreshData();
				this.messageServiceExt.addMessage('success', 'Status', 'Przydzielono produkcję do zamówienia');
			});
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
		} else {
			filt = this.datatable.filteredValue;
		}
		let dataToGenerateFile: any[] = [];
		for (let i = 0; i < filt.length; i++) {
			let zestawy = "";
			let sezon ="";
			let orderDateTmp = new Date(filt[i].orderDate);
			let address = "";
			for (let n = 0; n < filt[i].orderItems.length; n++) {
				zestawy += filt[i].orderItems[n].basket.basketName;
				//zestawy += " sezon: " + filt[i].orderItems[n].basket.basketSezon.basketSezonName;
				zestawy += " ilość. " + filt[i].orderItems[n].quantity + " szt. | ";
				sezon += filt[i].orderItems[n].basket.basketSezon.basketSezonName + " ";
			}
			let companyTmp: string;
			if (filt[i].customer.company == null) {
				companyTmp = "Brak"
			} else {
				companyTmp = filt[i].customer.company.companyName;
			}
			dataToGenerateFile[i] = {
				"Data Zamówienia": orderDateTmp.toLocaleString(),
				"FV": filt[i].orderFvNumber,
				"Nazwa Klienta": filt[i].customer.name,
				"Firma": companyTmp,
				"Email": filt[i].customer.email,
				"Telefon": filt[i].customer.phoneNumber,
				"Wartość zamówienia": filt[i].orderTotalAmount / 100,
				"Sezon": sezon,
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

	private setExportMenu() {
		this.exportItems = [
			{
				label: 'Export Zamówienia',
				icon: 'fa fa-arrow-down',
				command: () => this.generateXls()
			},
			{
				label: 'Export Klienci',
				icon: 'fa fa-arrow-down',
				command: () => this.generateCustomerXls()
			},
		]
	}

	changeRowPerPage() {
		//this.datatable.rows = 5000;
		//this.datatable._filter();
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
		if (this.authenticationService.isProdukcjaUser()) {
			this.items = [
				{
					label: 'Szybki podgląd zamówienia',
					icon: 'fa fa-search',
					command: () => this.showOrderPreview(event)
				},
				{
					label: 'Zmień status ', icon: 'fa fa-share',
					items: [
						{
							label: 'w trakcie realizacji',
							icon: 'pi pi-fw pi-plus',
							command: () => this.changeOrderStatus(this.ORDER_STATUS_W_TRAKCIE_REALIZACJI)
						},
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
		} else if (this.authenticationService.isMagazynUser() || this.authenticationService.isWysylkaUser()) {
			this.items = [
				{
					label: 'Szybki podgląd zamówienia',
					icon: 'fa fa-search',
					command: () => this.showOrderPreview(event)
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
		} else if (this.authenticationService.isBiuroUser()) {
			this.items = [
				{
					label: 'Szybki podgląd zamówienia',
					icon: 'fa fa-search',
					command: () => this.showOrderPreview(event)
				},
				{label: 'Pokaż załącznik(i)', icon: 'fa fa-paperclip', command: () => this.showAttachment()},
				{label: 'Wydrukuj', icon: 'fa fa-print', command: () => this.printMultiplePdf()},
				{
					label: 'Wydrukuj potwierdzenie',
					icon: 'fa fa-file-pdf-o',
					command: () => this.printMultipleDeliveryPdf()
				},
				{
					label: 'Duplikuj zamówienie',
					icon: 'fa fa-clone',
					command: () => this.router.navigate(["/orders/copy/" + this.selectedOrderFromRow.orderId])
				},
				{
					label: 'Wydrukuj komplet ', icon: 'fa fa-window-restore', command: () => {
						this.printMultipleDeliveryPdf();
						this.printMultiplePdf();
					}
				},
			];
		}
		else {
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
						{
							label: 'w trakcie realizacji',
							icon: 'pi pi-fw pi-plus',
							command: () => this.changeOrderStatus(this.ORDER_STATUS_W_TRAKCIE_REALIZACJI)
						},
						{
							label: 'Anulowane',
							icon: 'pi pi-fw pi-plus',
							command: () => this.showDeleteOrderPanel(this.selectedOrderFromRow)
						},
					]
				},
				{
					label: 'Status płatności', icon: 'fa fa-share',
					items: [
						{label: 'opłacone', icon: 'pi pi-fw pi-plus', command: () => this.changePaymentStatus(1)},
						{
							label: 'nieopłacone',
							icon: 'pi pi-fw pi-plus',
							command: () => this.changePaymentStatus(0)
						},

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
					label: 'Duplikuj zamówienie',
					icon: 'fa fa-clone',
					command: () => this.router.navigate(["/orders/copy/" + this.selectedOrderFromRow.orderId])
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