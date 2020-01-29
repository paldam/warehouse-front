import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Basket} from '../../model/basket.model';
import {OrderItem} from '../../model/order_item';
import {BasketService} from '../../basket/basket.service';
import {Customer} from '../../model/customer.model';
import {CustomerService} from '../../customer/customer.service';
import {NgForm} from '@angular/forms';
import {Order} from '../../model/order.model';
import {OrderService} from '../order.service';
import {DeliveryType} from '../../model/delivery_type.model';
import {OrderStatus} from "../../model/OrderStatus";
import {ConfirmationService, DataTable, FileUpload, LazyLoadEvent, MenuItem, Panel, SelectItem} from "primeng/primeng";
import {AuthenticationService, TOKEN, TOKEN_USER} from "../../authentication.service";
import {Router} from "@angular/router";
import {Address} from "../../model/address.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {Company} from "../../model/company.model";
import {StringUtils} from "../../string-utils";
import {SpinerService} from "../../spiner.service";
import {AppConstants} from "../../constants";
import {interval, Subscription} from "rxjs";
import {UserService} from "../../user.service";
import {User} from "../../model/user.model";
declare var jquery: any;
declare var $: any;

@Component({
	selector: 'basket-order',
	templateUrl: './basket-order.component.html',
	styleUrls: ['./basket-order.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class BasketOrderComponent implements OnInit, OnDestroy {
	public DELIVERY_TYPE_KURIER_PACZKA_POBRANIE = AppConstants.DELIVERY_TYPE_KURIER_PACZKA_POBRANIE;
	public DELIVERY_TYPE_OBIOR_OSOBISTY_POBRANIE = AppConstants.DELIVERY_TYPE_OBIOR_OSOBISTY_POBRANIE;
	public DELIVERY_TYPE_NASZ_KIEROWCA_POBRANIE = AppConstants.DELIVERY_TYPE_NASZ_KIEROWCA_POBRANIE;
	public selectedCompanyToMarge: Company [] = [];
	public company: Company = {companyId: 0, companyName: "Klient indywidualny"};
	public companyToPersist: Company = new Company();
	public customers: Customer[] = [];
	public customer: Customer = new Customer();
	public orderAddress: Address = new Address();
	public companyList: any[] = [];
	public companyAddressList: Address[] = [];
	public companyNameToMarge: string;
	public addressPickDialogShow: boolean = false;
	public order: Order = new Order();
	public total: number = 0;
	public formSubmitted: boolean = false;
	public formCompanyAddForm = false;
	public formCompanyMargeForm: boolean = false;
	public clickSelectCompanyGuard: boolean = false;
	public totalRecords: number;
	public clickSelectCustomerGuard: boolean = false;
	public deliveryTypes: DeliveryType[] = [];
	public deliveryType: DeliveryType = new DeliveryType();
	public orderItems: OrderItem[] = [];
	public baskets: Basket[] = [];
	public loading: boolean;
	public companyAddDialogShow: boolean = false;
	public confirmDialogShow: boolean = false;
	public customerPickDialogShow: boolean = false;
	public companyPickDialogShow: boolean = false;
	public mergeCompanyPanelShow: boolean = false;
	public loyaltyProgramUserPanelShow: boolean = false;
	public generatedOrderId: number = null;
	public items: MenuItem[];
	public tmpCityList: any[] = [];
	public pickCityByZipCodeWindow: boolean = false;
	public programUsers: User [] = [];
	public weekOfYearTmp: Date;
	public weekOfYear: number;
	public basketSeasonList: SelectItem[] = [];
	public isDeliveryDateValid: boolean = true;
	public isDeliveryWeekDateValid: boolean = true;
	public isTextToCardVisible: boolean = false;
	public selectedBasketOnContextMenu: Basket = new Basket();
	public intervalSubscription: Subscription;
	@ViewChild('choseCompanyPanel') choseCompanyPanel: Panel;
	@ViewChild(FileUpload) fileUploadElement: FileUpload;
	@ViewChild('zip_code') el: any;
	@ViewChild('address2') storedCustomerAddressList: any;
	@ViewChild('companyPickMode') selectPickcompany: ElementRef;
	@ViewChild('globalfilter2') globalfilter2: ElementRef;
	@ViewChild('dtCustomer') datatableCustomer: DataTable;
	@ViewChild('dt') datatable: DataTable;
	value: Date;
	dateLang: any;

	constructor(private router: Router, private basketService: BasketService, private spinerService: SpinerService,
				private  customerService: CustomerService, private orderService: OrderService,
				private userService: UserService, private messageServiceExt: MessageServiceExt,
				private confirmationService: ConfirmationService, private authenticationService: AuthenticationService){

		customerService.getCustomers().subscribe(data => this.customers = data);
		orderService.getCompany().subscribe(data => this.companyList = data);
		orderService.getDeliveryTypes().subscribe(data => this.deliveryTypes = data);
		this.getBasketSeasonForDataTableFilter();
		basketService.getBasketsPage(
			1, 20, "", "basketName", -1, false, [])
			.subscribe((data: any) => {
			this.baskets = data.basketsList;
			this.totalRecords = data.totalRowsOfRequest;
		});
	}

	ngOnInit() {
		this.dateLang = {
			firstDayOfWeek: 0,
			dayNames: ["Sobota", "Poniedziałek", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			dayNamesShort: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
			dayNamesMin: ["Nd", "Po", "Wt", "Śr", "Cz", "Pi", "So"],
			monthNames: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień",
						"Wrzesień", "Październik", "Listopad", "Grudzień"],
			monthNamesShort: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
			today: 'Dzisiaj',
			clear: 'czyść'
		};
		this.items = [
			{
				label: 'Dodaj kosz',
				icon: 'fa fa-plus',
				command: (event) => this.addBasketToOrder(this.selectedBasketOnContextMenu)
			},
		];
		this.customer.company = null;
	}

	ngOnDestroy() {
	}

	ngAfterViewInit(): void {
		$(document).ready(function () {
			$(function () {
				$("#datepicker").datepicker({
					dateFormat: "dd.mm.yy"
				});
			});
		})
	}

	private getBasketSeasonForDataTableFilter() {
		this.basketService.getBasketSeason().subscribe(data => {
			data.forEach(value => {
				this.basketSeasonList.push({label: '' + value.basketSezonName, value: value.basketSezonId});
			});
		});
	}

	contextMenuSelected(event) {
		this.selectedBasketOnContextMenu = event.data;
	}

	addBasketToOrder(basket: Basket) {
		if (basket.basketId == AppConstants.BASKET_GRAWER_ID) {
			this.messageServiceExt.addMessageWithTime(
				'success', 'Uwaga', 'Dodano do zamówienia grawer, pamiętaj o wgraniu plików', 25000);
		}
		if (basket.basketId == AppConstants.BASKET_KARTKA_BEZ_LOGO_ID || basket.basketId == AppConstants.BASKET_KARTKA_Z_LOGO_ID) {
			this.isTextToCardVisible = true;
			this.messageServiceExt.addMessageWithTime(
				'success', 'Uwaga', 'Dodano do zamówienia kartkę, pamiętaj o wpisaniu tekstu', 25000);
		}
		let line = this.orderItems.find(data => data.basket.basketId == basket.basketId);
		if (line == undefined) {
			this.orderItems.push(new OrderItem(basket, 1))
		} else {
			line.quantity = line.quantity + 1;
		}
		this.recalculate();
	}

	loadBasketsLazy(event: LazyLoadEvent) {
		this.loading = true;
		let pageNumber = 0;
		if (event.first) {
			pageNumber = event.first / event.rows;
		}
		let sortField = event.sortField;
		if (sortField == undefined) {
			sortField = "basketName";
		}
		let basketSeasonList: any[] = [];
		if (event.filters != undefined && event.filters["basketSezon.basketSezonName"] != undefined) {
			basketSeasonList = event.filters["basketSezon.basketSezonName"].value;
		}
		this.basketService.getBasketsPage(
			pageNumber, event.rows, event.globalFilter, sortField, event.sortOrder, false, basketSeasonList)
			.subscribe((data: any) => {
				this.baskets = data.basketsList;
				this.totalRecords = data.totalRowsOfRequest;
			}, null
			, () => {
				this.loading = false;
			})
	}

	updateQuantity(basketLine: OrderItem, quantity: number) {
		if (quantity == 0) {
			this.deleteProductLine(basketLine.basket.basketId);
		}
		let line = this.orderItems.find(line => line.basket.basketId == basketLine.basket.basketId);
		if (line != undefined) {
			line.quantity = Number(quantity);
		}
		this.recalculate();
	}

	isBasketLinesEmpty(): boolean {
		return this.orderItems.length == 0;
	}

	cleanLoyaltyUser() {
		this.order.loyaltyUser = null;
	}

	pickLoyaltyUser(user) {
		this.order.loyaltyUser = user;
		this.loyaltyProgramUserPanelShow = false;
	}

	prepereLoyaltyUserPanel() {
		this.loyaltyProgramUserPanelShow = true;
		this.userService.getProgramUsers().subscribe(data => {
			this.programUsers = data;
		})
	}

	private setBasketsListAutoRefresh() {
		this.intervalSubscription = interval(20000).subscribe(x => {
			this.basketService.getBaskets().subscribe(data => this.baskets = data);
		});
	}

	deleteProductLine(id: number) {
		let index = this.orderItems.findIndex(data => data.basket.basketId == id);
		if (index > -1) {
			this.orderItems.splice(index, 1);
			this.deactiveTextToCardIfNoCardInOrder(id);
		}
		this.recalculate();
	}

	private deactiveTextToCardIfNoCardInOrder(basketId: number) {
		if (basketId == AppConstants.BASKET_KARTKA_BEZ_LOGO_ID || basketId == AppConstants.BASKET_KARTKA_Z_LOGO_ID) {
			let isAnyCardInOrder = this.orderItems
				.find(data => data.basket.basketId == AppConstants.BASKET_KARTKA_BEZ_LOGO_ID
					|| data.basket.basketId == AppConstants.BASKET_KARTKA_Z_LOGO_ID);
			if (!isAnyCardInOrder) {
				this.isTextToCardVisible = false;
				this.order.textToCard = null;
			}
		}
	}

	cleanCompany() {
		this.company = {companyId: 0, companyName: "Klient indywidualny"};
		this.clickSelectCompanyGuard = false;
	}

	cleanCustomer() {
		this.customer = new Customer();
		this.clickSelectCustomerGuard = false;
	}

	cleanAddress() {
		this.orderAddress = new Address();
	}

	editAddressMode() {
		this.orderAddress.addressId = null;
	}

	recalculate() {
		this.total = 0;
		this.orderItems.forEach(orderItem => {
			this.total += (orderItem.basket.basketTotalPrice * orderItem.quantity);
		})
	}

	pickCustomer(customer: Customer) {
		this.customer = customer;
		if (customer.company == null) {
			this.company = new Company();
		} else {
			this.company = customer.company;
			this.clickSelectCompanyGuard = true;
			this.clickSelectCustomerGuard = true
		}
		this.customerPickDialogShow = false;
	}

	pickCompany(event) {
		this.companyPickDialogShow = false;
		this.company = event;
		if (this.company.wasCombined == 1) {
			this.messageServiceExt.addMessage(
				'success', 'Uwaga', 'Wybrana firma była scalana w przeszłości');
		}
		this.clickSelectCompanyGuard = true;
	}

	pickAddress(event) {
		this.orderAddress = event;
		this.addressPickDialogShow = false;
		console.log(this.orderAddress);
	}

	isAdmin(): boolean {
		return this.authenticationService.isAdmin();
	}

	showCustomerList() {
		this.globalfilter2.nativeElement.value = this.company.companyName;
		this.customerPickDialogShow = true;
		this.datatableCustomer.filter(this.company.companyId, 'company.companyId', 'equals');
	}

	showAddressesList() {
		this.addressPickDialogShow = true;
		console.log("WWW" + this.company.companyId);
		this.orderService.getAddressesByCompanyId(this.company.companyId).subscribe(data => {
			this.companyAddressList = data;
		});
	}

	showCompanyList() {
		this.orderService.getCompany().subscribe(data => this.companyList = data);
		this.clickSelectCompanyGuard = false;
		this.companyPickDialogShow = true;
	}

	onHideComapnyPanel() {
		this.selectedCompanyToMarge = [];
		if (this.company.companyId) {
			this.clickSelectCompanyGuard = true;
		}
	}

	mergeCompany() {
		this.mergeCompanyPanelShow = true;
	}

	selectCompanyNameInMergePanel(companyName: string) {
		this.companyNameToMarge = companyName;
	}

	deleteCompanyNameInMergePanel(comapnyId: number) {
		let index = this.selectedCompanyToMarge.findIndex(data => data.companyId == comapnyId);
		if (index > -1) {
			this.selectedCompanyToMarge.splice(index, 1);
		}
		if (this.selectedCompanyToMarge.length == 0) {
			this.mergeCompanyPanelShow = false;
			this.selectedCompanyToMarge = [];
		}
	}

	cleanForm(form: NgForm, formAdidtional: NgForm) {
		form.resetForm();
		formAdidtional.resetForm();
		this.order = new Order();
		this.customer = new Customer();
		this.formSubmitted = false;
		this.orderAddress = new Address();
		this.clickSelectCompanyGuard = false;
		this.clickSelectCustomerGuard = false;
		this.company = new Company();
		this.customerService.getCustomers().subscribe(data => this.customers = data);
	}

	submitMergeCompanyForm(companyMergeForm: NgForm) {
		this.formCompanyMargeForm = true;
		if (companyMergeForm.valid) {
			this.spinerService.showSpinner = true;
			this.orderService.getMergeCompanies(this.selectedCompanyToMarge, this.companyNameToMarge)
				.subscribe(data => {
				this.company = data;
			}, error => {
				this.messageServiceExt.addMessage(
					'error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);
				this.mergeCompanyPanelShow = false;
				this.spinerService.showSpinner = false;
				this.selectedCompanyToMarge = [];
			}, () => {
				this.messageServiceExt.addMessage(
					'success', 'Status', 'Poprawnie scalono firmy');
				setTimeout(() => {
					this.spinerService.showSpinner = false;
				}, 900);
				this.mergeCompanyPanelShow = false;
				this.selectedCompanyToMarge = [];
				this.orderService.getCompany().subscribe(data => this.companyList = data);
				this.companyPickDialogShow = false;
			})
		}
	}

	onCloseMergePanel() {
		this.companyNameToMarge = null;
	}

	submitCompanyAddForm(formCompanyAdd: NgForm) {
		this.formCompanyAddForm = true;
		if (formCompanyAdd.valid) {
			this.spinerService.showSpinner = true;
			this.orderService.saveCompany(this.companyToPersist).subscribe(data => {
				this.companyToPersist = new Company();
				this.formCompanyAddForm = false;
				this.messageServiceExt.addMessage(
					'success', 'Status', 'Poprawnie dodano firmę');
				this.company = data;
			}, error => {
				this.messageServiceExt.addMessage(
					'error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);
				this.companyAddDialogShow = false;
				this.spinerService.showSpinner = false;
			}, () => {
				this.companyAddDialogShow = false;
				this.spinerService.showSpinner = false;
			});
		}
	}

	submitOrderForm(form: NgForm, formAdidtional: NgForm) {
		this.formSubmitted = true;
		if (this.isAllDataValid(form, formAdidtional)) {
			this.setUpOrderBeforeSave();
			this.orderService.saveOrder(this.order).subscribe(
				data => {
					this.generatedOrderId = data.orderId;
					this.fileUploadElement.url = AppConstants.FILE_UPLOAD_URL + data.orderId;
					this.fileUploadElement.upload();
				},
				error => {
					this.messageServiceExt.addMessage(
						'error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);
				},
				() => {
					this.recalculate();
					this.showAddOrderConfirmModal();
					this.cleanAfterSave(form, formAdidtional);
					this.customerService.getCustomers().subscribe(data => this.customers = data)
				}
			);
		}
	}

	private isAllDataValid(form: NgForm, formAdidtional: NgForm): boolean {
		return (form.valid && formAdidtional.valid && this.orderItems.length > 0 && this.isDeliveryDateValid &&
			this.isDeliveryWeekDateValid);
	}

	private setUpOrderBeforeSave() {
		this.order.orderTotalAmount = this.total;
		this.order.orderItems = this.orderItems;
		this.order.orderItems.forEach((value: OrderItem) => {
			if (!value.stateOnLogistics) {
				value.stateOnLogistics = 0;
			}
			if (!value.stateOnWarehouse) {
				value.stateOnWarehouse = 0;
			}
			if (!value.stateOnProduction) {
				value.stateOnProduction = 0;
			}
			value.quantityFromSurplus = 0;
		});
		this.order.additionalSale = 0;
		this.order.customer = this.customer;
		if (StringUtils.isBlank(this.company.companyName)) {
			this.order.customer.company = {companyId: 0, companyName: "Klient indywidualny"}
		} else {
			this.order.customer.company = this.company;
		}
		this.order.address = this.orderAddress;
		if (this.order.deliveryType.deliveryTypeId == AppConstants.DELIVERY_TYPE_KURIER_PACZKA_POBRANIE
			|| this.order.deliveryType.deliveryTypeId == AppConstants.DELIVERY_TYPE_OBIOR_OSOBISTY_POBRANIE
			|| this.order.deliveryType.deliveryTypeId == AppConstants.DELIVERY_TYPE_NASZ_KIEROWCA_POBRANIE) {
			this.order.cod *= 100;
		} else {
			this.order.cod = 0;
		}
		this.autoAddTicketsToOrder();
		this.order.orderStatus = new OrderStatus(AppConstants.ORDER_STATUS_NOWE);
		this.order.userName = localStorage.getItem(TOKEN_USER);
		this.order.weekOfYear = this.getWeekNumber(this.weekOfYearTmp);
	}

	cleanAfterSave(form: NgForm, formAdidtional: NgForm) {
		this.formSubmitted = false;
		this.customer = new Customer();
		this.recalculate();
		this.orderItems = [];
		form.resetForm();
		this.weekOfYear = null;
		formAdidtional.resetForm();
		this.order.address = new Address();
		this.cleanAddress();
		this.cleanCompany();
		this.cleanCustomer()
	}

	private autoAddTicketsToOrder() {
		if (this.order.deliveryType.deliveryTypeId == AppConstants.DELIVERY_TYPE_PACZKA_KURIER_ID) {
			this.removeAllTicketsFromOrderIfExist();
			let totalBasketNumberOfOrder = 0;
			this.order.orderItems.forEach(orderItemLine => {
				if (!this.isProductKartkaOrGrawer(orderItemLine.basket.basketId)) {
					totalBasketNumberOfOrder += orderItemLine.quantity;
				}
			});
			this.order.orderItems.push(
				new OrderItem(
					new Basket(AppConstants.BASKET_BILECIK_ID), totalBasketNumberOfOrder, null, 0, 0, 0, 0));
			if (totalBasketNumberOfOrder > 0) {
				this.messageServiceExt.addMessage(
					'success', 'Informacja', 'Dodano automatycznie ' + totalBasketNumberOfOrder + ' bilecik(ów) ');
			}
		}
	}

	private isProductKartkaOrGrawer(basketId: number): boolean {
		return basketId == AppConstants.BASKET_GRAWER_ID || basketId == AppConstants.BASKET_KARTKA_BEZ_LOGO_ID ||
			basketId == AppConstants.BASKET_KARTKA_Z_LOGO_ID
	}

	private removeAllTicketsFromOrderIfExist() {
		let indexOfTicketInOrderLine = this.orderItems.findIndex(data => data.basket.basketId == 326);
		if (indexOfTicketInOrderLine > -1) {
			this.orderItems.splice(indexOfTicketInOrderLine, 1);
		}
	}

	printPdf() {
		this.orderService.getPdf(this.generatedOrderId).subscribe(res => {
			let fileURL = URL.createObjectURL(res);
			window.open(fileURL);
		});
		this.generatedOrderId = null;
	}

	addCompanyShowPanel() {
		this.companyAddDialogShow = true;
	}

	showAddOrderConfirmModal() {
		this.confirmDialogShow = true;
	}

	hideAddOrderConfirmModal() {
		this.confirmDialogShow = false;
	}

	cancelCreateOrder() {
		this.router.navigateByUrl('/orders/all');
	}

	ZipCodeUtil(zipCode: string) {
		if (this.el.valid) {
			this.pickCityByZipCodeWindow = true;
			this.customerService.getCityByZipCode(zipCode).subscribe(data => {
				data.forEach((value) => {
					this.tmpCityList.push(value.zipCode.city);
				});
			})
		}
	}

	selectCity(city: string) {
		this.orderAddress.cityName = city;
		this.tmpCityList = [];
		this.pickCityByZipCodeWindow = false;
	}

	clearOnCloseDialog() {
		this.tmpCityList = [];
	}

	onBeforeUpload(event) {
		let token = localStorage.getItem(TOKEN);
		event.xhr.setRequestHeader('Authorization', `Bearer ${token}`);
	}

	getWeekNumber(d: Date): number {
		d = new Date(d);
		d.setHours(0, 0, 0);
		d.setDate(d.getDate() + 4 - (d.getDay() || 7));
		let yearStart = new Date(d.getFullYear(), 0, 1);
		return Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7)
	}

	OnWeekOfYearDateChange() {
		this.weekOfYear = this.getWeekNumber(this.weekOfYearTmp);
		this.isDeliveryWeekValid();
	}

	closeCustomerPicker() {
		if (this.customer.name == null) {
		}
	}

	isDeliveryWeekValid() {
		let weekOfYearFromNowDate = this.getWeekNumber(new Date());
		this.isDeliveryWeekDateValid = weekOfYearFromNowDate <= this.weekOfYear;
	}

	onDeliveryDataChange() {
		let tmpDeliveryDate = new Date(this.order.deliveryDate);
		tmpDeliveryDate.setHours(23, 59, 59, 99);
		let now = new Date();
		console.log(now.getTime());
		this.isDeliveryDateValid = tmpDeliveryDate.getTime() > now.getTime();
	}

	compareDeliveryType(optionOne: DeliveryType, optionTwo: DeliveryType): boolean {
		return optionTwo && optionTwo ? optionOne.deliveryTypeId === optionTwo.deliveryTypeId : optionOne === optionTwo;
	}
}