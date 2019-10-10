import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../order.service";
import {Order} from "../../model/order.model";
import {OrderItem} from "../../model/order_item";
import {DeliveryType} from "../../model/delivery_type.model";
import {Customer} from "../../model/customer.model";
import {OrderStatus} from "../../model/OrderStatus";
import {Product} from "../../model/product.model";
import {Checkbox, ConfirmationService, DataTable, FileUpload, SelectItem} from "primeng/primeng";
import {AuthenticationService} from "../../authentication.service";
import {Basket} from "../../model/basket.model";
import {BasketService} from "../../basket/basket.service";
import {File} from "../../model/file";
import {FileSendService} from "../../file-send/file-send.service";
import {TOKEN, TOKEN_USER} from '../../authentication.service';
import {MenuItem} from "primeng/api";
import {Address} from "../../model/address.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {NgForm} from "@angular/forms";
import {Company} from "../../model/company.model";
import {CustomerService} from "../../customer/customer.service";
import {StringUtils} from "../../string-utils";
import {SpinerService} from "../../spiner.service";
import {RoutingState} from "../../routing-stage";
import {AppConstans} from "../../constans";
import {User} from "../../model/user.model";
import {UserService} from "../../user.service";

@Component({
	selector: 'order-details',
	templateUrl: './order-details.component.html',
	styleUrls: ['./order-details.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class OrderDetailsComponent implements OnInit {
	private static SECOND_IN_MILLIS: number = 1000;
	public order: Order = new Order();
	public programUsers: User []=[];
	public originOrderIdCopy = null;
	public orderItems: OrderItem[] = [];
	public deliveryTypes: DeliveryType[] = [];
	public customer: Customer = new Customer();
	public isReadOnlyProp: boolean = true;
	public formSubmitted: boolean = false;
	public orderStatus: OrderStatus[] = [];
	public loading: boolean = false;
	public totalAmount: number;
	public orderStatusId: number;
	public baskets: Basket[] = [];
	public total: number = 0;
	public companyToPersist: Company = new Company();
	public formCompanyAddForm = false;
	public companyAddDialogShow: boolean = false;
	public companyList: any[] = [];
	public companyPickDialogShow: boolean = false;
	public clickSelectcomapnyGuard: boolean = false;
	public clickSelectCustomerGuard: boolean = true;
	public loyaltyProgramUserPanelShow: boolean = false;
	public customers: Customer[] = [];
	public customerPickDialogShow: boolean = false;
	public fileList: File[] = [];
	public companyAddressList: Address[] = [];
	public auditList: any[] = [];
	public orderId: number;
	public items: MenuItem[];
	public selectedBasketOnContextMenu: Basket = new Basket();
	public confirmDialogShow: boolean = false;
	filtersLoaded: Promise<boolean>;
	public weekOfYearTmp: Date;
	public weekOfYear: number;
	public checkedAdditionalSale: boolean = false;
	public isDeliveryDateValid: boolean = true;
	public isDeliveryWeekDateValid: boolean = true;
	public addressPickDialogShow: boolean = false;
	public basketSeasonList: SelectItem[] = [];
	public isTextToCardVisible: boolean = false;
	@ViewChild('form') orderForm: NgForm;
	@ViewChild('formAdidtional') additionalForm: NgForm;
	@ViewChild(Checkbox) el: Checkbox;
	@ViewChild(FileUpload) fileUploadElement: FileUpload;
	@ViewChild('globalfilter2') globalfilter2: ElementRef;
	@ViewChild('dtCustomer') datatableCustomer: DataTable;
	@ViewChild('dtt') basketTable: DataTable;
	public company: Company = new Company();
	public orderAddress: Address = new Address();

	constructor(private confirmationService: ConfirmationService, private fileSendService: FileSendService,
				private basketService: BasketService,private userService :UserService, private orderService: OrderService, activeRoute: ActivatedRoute,
				private  router: Router, private routingState: RoutingState, private spinerService: SpinerService, public authenticationService: AuthenticationService, private customerService: CustomerService, private messageServiceExt: MessageServiceExt) {
		this.orderId = activeRoute.snapshot.params["id"];
		this.getBasketSeasonForDataTableFilter();
		this.originOrderIdCopy = activeRoute.snapshot.params["id"];
		if (this.isCopyOfExistingOrder()) {
			this.setDataForCopyOfOrder();
		} else {
			this.setDataForOrderEdit()
		}
		this.orderService.getDeliveryTypes().subscribe(data => this.deliveryTypes = data);
		this.orderService.getOrderStatus().subscribe(data => {
			this.orderStatus = data;
			let tmp = this.orderStatus[1];
			this.orderStatus[1] = this.orderStatus[3];
			this.orderStatus[3] = tmp;
		}, error => {
			//TODO magic number
		}, () => {
			this.orderStatus = this.orderStatus.filter(value => (value.orderStatusId == 1 || value.orderStatusId == 6))
		});
		this.orderService.getFileList(this.orderId).subscribe(data => {
			this.fileList = data;
		});
		this.basketService.getBaskets().subscribe(data => this.baskets = data);
		this.orderService.getOrderAudit(this.orderId).subscribe(data => this.auditList = data)
		this.customerService.getCustomers().subscribe(data => this.customers = data);
		this.orderService.getCompany().subscribe(data => this.companyList = data);
	}

	ngOnInit() {
		this.items = [
			{
				label: 'Dodaj kosz',
				icon: 'fa fa-plus',
				command: (event) => this.addBasketToOrder(this.selectedBasketOnContextMenu)
			},
		];
		if (this.isCopyOfExistingOrder()) {
			this.fileUploadElement.url = null;
		}

	}

	private setVisabilityOfTextToCardField() {
		let isAnyCardInOrder = this.order.orderItems.find(data => data.basket.basketId == 187 || data.basket.basketId == 188);
		if (!isAnyCardInOrder) {
			this.isTextToCardVisible = false;
			this.order.textToCard = null;
		} else {
			this.isTextToCardVisible = true;
		}
	}

	private getBasketSeasonForDataTableFilter() {
		this.basketService.getBasketSeason().subscribe(data => {
			data.forEach(value => {
				this.basketSeasonList.push({label: '' + value.basketSezonName, value: value.basketSezonId});
			});
		});
	}
	


	private setDataForOrderEdit() {
		this.orderService.getOrder(this.orderId).subscribe(res => {
			this.orderAddress = res.address;
			this.company = res.customer.company;
			this.order = res;
			this.customer = res.customer;
			this.orderItems = res.orderItems;
			this.totalAmount = res.orderTotalAmount / 100;
			this.order.cod /= 100;
			this.recalculate();
			this.fileUploadElement.url = "http://www.kosze.waw.pl:8080/uploadfiles?orderId=" + this.orderId;
			this.filtersLoaded = Promise.resolve(true);
			this.weekOfYear = res.weekOfYear;
			if (res.additionalSale == 1) {
				this.el.checked = true;
				this.checkedAdditionalSale = true;
			} else {
				this.el.checked = false;
				this.checkedAdditionalSale = false;
			}
		}, error1 => {
		}, () => {
			this.setVisabilityOfTextToCardField();
		});
	};

	private setDataForCopyOfOrder() {
		this.order.orderId = null;
		this.order.orderStatus = new OrderStatus(1);
		this.order.orderDate = null;
		this.order.orderFvNumber = null;
		this.order.orderItems = [];
		this.orderItems = [];
		this.totalAmount = 0;
		this.order.cod /= 0;
		//this.fileUploadElement.url = null;
		this.filtersLoaded = Promise.resolve(true);
		this.orderService.getOrder(this.orderId).subscribe(res => {
			this.orderAddress = res.address;
			this.company = res.customer.company;
			this.order.deliveryType = res.deliveryType;
			this.order.productionUser = res.productionUser;
			this.order.deliveryDate = res.deliveryDate;
			this.order.additionalInformation = res.additionalInformation;
			this.customer = res.customer;
			this.weekOfYear = res.weekOfYear;
			if (res.additionalSale == 1) {
				this.el.checked = true;
				this.checkedAdditionalSale = true;
			} else {
				this.el.checked = false;
				this.checkedAdditionalSale = false;
			}
		}, error => {
		}, () => {
			this.setVisabilityOfTextToCardField();
		});
	}

	isCopyOfExistingOrder(): boolean {
		return this.routingState.getCurrentPage().substring(0, 12) == "/orders/copy";
	};

	 isEditOrderType(): boolean {
		return !this.isCopyOfExistingOrder();
	};

	public getTitleForMainFieldset(fv: string): string {
		if (this.isCopyOfExistingOrder()) {
			return "Duplikat zamówienia ";
		} else {
			return "Szczegóły zamówienia nr " + fv;
		}
	}

	cleanCustomer() {
		this.customer = new Customer();
		this.clickSelectCustomerGuard = false;
	}

	cleanCompany() {
		this.company = {companyId: 0, companyName: "Klient indywidualny"};
		this.clickSelectcomapnyGuard = false;
	}

	closeCustomerPicker() {
		if (this.customer.name == null) {
			//this.storedCustomerMode=false;
		}
	}

	pickCompany(event) {
		this.companyPickDialogShow = false;
		this.company = event;
		this.clickSelectcomapnyGuard = true;
	}

	pickCustomer(customer: Customer) {
		this.customer = customer;
		if (customer.company == null) {
			this.company = new Company();
		} else {
			this.company = customer.company;
			this.clickSelectcomapnyGuard = true;
			this.clickSelectCustomerGuard = true
		}
		this.customerPickDialogShow = false;
	}

	addCompanyShowPanel() {
		this.companyAddDialogShow = true;
	}

	onHideComapnyPanel() {
		if (this.company.companyId) {
			this.clickSelectcomapnyGuard = true;
		}
	}

	showCustomerList() {
		this.customerService.getCustomers().subscribe(data => this.customers = data);
		this.globalfilter2.nativeElement.value = this.company.companyName;
		this.customerPickDialogShow = true;
		this.datatableCustomer.filter(this.company.companyId, 'company.companyId', 'equals');
	}

	showCompanyList() {
		this.orderService.getCompany().subscribe(data => this.companyList = data);
		this.clickSelectcomapnyGuard = false;
		this.companyPickDialogShow = true;
	}

	showAddressesList() {
		this.addressPickDialogShow = true;
		this.orderService.getAddressesByCompanyId(this.company.companyId).subscribe(data => {
			this.companyAddressList = data;
		});
	}

	submitCompanyAddForm(formCompanyAdd: NgForm) {
		this.formCompanyAddForm = true;
		if (formCompanyAdd.valid) {
			this.spinerService.showSpinner = true;
			this.orderService.saveCompany(this.companyToPersist).subscribe(data => {
				this.companyToPersist = new Company();
				this.formCompanyAddForm = false;
				this.messageServiceExt.addMessage('success', 'Status', 'Poprawnie dodano firmę');
				this.company = data;
			}, error => {
				this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);
				this.companyAddDialogShow = false;
				this.spinerService.showSpinner = false;
			}, () => {
				this.companyAddDialogShow = false;
				this.spinerService.showSpinner = false;
			});
		}
	}

	contextMenuSelected(event) {
		this.selectedBasketOnContextMenu = event.data;
	}

	compareDeliveryType(optionOne: DeliveryType, optionTwo: DeliveryType): boolean {
		return optionTwo && optionTwo ? optionOne.deliveryTypeId === optionTwo.deliveryTypeId : optionOne === optionTwo;
	}

	compareAddress(optionOne: Address, optionTwo: Address): boolean {
		return optionTwo && optionTwo ? optionOne.addressId === optionTwo.addressId : optionOne === optionTwo;
	}

	compareOrderStatus(optionOne: OrderStatus, optionTwo: OrderStatus): boolean {
		return optionTwo && optionTwo ? optionOne.orderStatusId === optionTwo.orderStatusId : optionOne === optionTwo;
	}

	isFormReadOnly(): boolean {
		return this.isReadOnlyProp;
	}

	//todo refact
	editOrderForm() {
		this.formSubmitted = true;
		if (this.orderForm.valid && this.additionalForm.valid && this.isDeliveryDateValid && this.isDeliveryWeekDateValid && this.orderItems.length > 0) {
			if (this.order.deliveryType.deliveryTypeId == 5 || this.order.deliveryType.deliveryTypeId == 6 || this.order.deliveryType.deliveryTypeId == 7) {
				this.order.cod *= 100;
			} else {
				this.order.cod = 0;
			}
			this.autoAddTicketsToOrder();
			if (this.checkedAdditionalSale == true) {
				this.order.additionalSale = 1;
			} else {
				this.order.additionalSale = 0;
			}
			this.order.customer = this.customer;
			if (StringUtils.isBlank(this.company.companyName)) {
				this.order.customer.company = {companyId: 0, companyName: "Klient indywidualny"}
			} else {
				this.order.customer.company = this.company;
			}
			this.order.customer = this.customer;
			this.order.orderTotalAmount = this.total;
			this.order.weekOfYear = this.weekOfYear;
			this.order.address = this.orderAddress;
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
			});
			if (this.isEditOrderType()) {
				this.orderService.saveOrder(this.order).subscribe(data => {
					this.fileUploadElement.url = "http://www.kosze.waw.pl:8080/uploadfiles?orderId=" + this.orderId;  // PrimeNg fileUpload component
					this.fileUploadElement.upload();
					setTimeout(() => {
						this.router.navigateByUrl('/orders/all');
						this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji zamówienia', 5000);
					}, 400);
				}, error => {
					this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error._body + ' ' + error.statusText);
				})
			} else {
				this.order.orderItems = this.orderItems;
				this.order.orderItems.forEach(orderItem => {
					orderItem.orderItemId = null;
					orderItem.stateOnWarehouse = 0;
					orderItem.stateOnProduction = 0;
					orderItem.stateOnLogistics = 0;
				});
				this.orderService.saveOrderFromCopy(this.order, this.originOrderIdCopy).subscribe(data => {
					this.fileUploadElement.url = "http://www.kosze.waw.pl:8080/uploadfiles?orderId=" + this.orderId;  // PrimeNg fileUpload component
					this.fileUploadElement.upload();
					setTimeout(() => {
						this.router.navigateByUrl('/orders/all');
						this.messageServiceExt.addMessageWithTime('success', 'Informacja:', 'Dodano zamówienie na podstawie wzoru', 5000);
						this.originOrderIdCopy = null;
					}, 400);
				}, error => {
					this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error._body + ' ' + error.statusText);
				})
			}
		}
	}

	private autoAddTicketsToOrder() {
		if (this.order.deliveryType.deliveryTypeId == AppConstans.DELIVERY_TYPE_PACZKA_KURIER_ID) {
			this.removeAllTicketsFromOrderIfExist();
			let totalBasketNumberOfOrder = 0;
			this.order.orderItems.forEach(orderItemLine => {
				if (!this.isProductKartkaOrGrawer(orderItemLine.basket.basketId)) {
					totalBasketNumberOfOrder += orderItemLine.quantity;
				}
			});
			this.order.orderItems.push(new OrderItem(new Basket(326), totalBasketNumberOfOrder, null, 0, 0, 0));
			if (totalBasketNumberOfOrder > 0) {
				this.messageServiceExt.addMessage('success', 'Informacja', 'Dodano automatycznie ' + totalBasketNumberOfOrder + ' bilecik(ów) ');
			}
		}
	}

	private removeAllTicketsFromOrderIfExist() {
		let indexOfTicketInOrderLine = this.orderItems.findIndex(data => data.basket.basketId == 326);
		if (indexOfTicketInOrderLine > -1) {
			this.orderItems.splice(indexOfTicketInOrderLine, 1);
		}
	}

	private isProductKartkaOrGrawer(basketId: number): boolean {
		return basketId == AppConstans.BASKET_GRAWER_ID || basketId == AppConstans.BASKET_KARTKA_BEZ_LOGO_ID || basketId == AppConstans.BASKET_KARTKA_Z_LOGO_ID
	}

	addBasketToOrder(basket: Basket) {

		if(this.order.orderStatus.orderStatusId == AppConstans.ORDER_STATUS_W_TRAKCIE_REALIZACJI ) {
			this.messageServiceExt.addMessageWithTime('error', 'Uwaga', 'Zamówienie w trakcie realizacji, brak możliwości edycji pozycji zamówienia', 25000);
		}else{

			if (basket.basketId == 206) {
				this.messageServiceExt.addMessageWithTime('success', 'Uwaga', 'Dodano do zamówienia grawer, pamiętaj o wgraniu plików', 25000);
			} //todo
			if (basket.basketId == 187 || basket.basketId == 188) {
				this.isTextToCardVisible = true;
				this.messageServiceExt.addMessageWithTime('success', 'Uwaga', 'Dodano do zamówienia kartkę, pamiętaj o wpisaniu tekstu', 25000);
			} //todo
			let line = this.orderItems.find(data => data.basket.basketId == basket.basketId);
			if (line == undefined) {
				this.orderItems.push(new OrderItem(basket, 1))
			} else {
				line.quantity = line.quantity + 1;
			}
			this.recalculate();
		}
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
		// this.recalculateTotalPlusMarkUp();
	}

	isBasketLinesEmpty(): boolean {
		if (this.orderItems.length == 0) {
			return true
		} else {
			return false
		}
	}

	pickAddress(event) {
		this.orderAddress = event;
		this.addressPickDialogShow = false;
		console.log(this.orderAddress);
	}

	cancelEdit() {
		this.router.navigateByUrl('/orders/all');
	}

	deleteProductLine(id: number) {
		let index = this.orderItems.findIndex(data => data.basket.basketId == id);
		if (index > -1) {
			this.orderItems.splice(index, 1);
			this.deactiveTextToCardIfNoCardInOrder(id);
		}
		this.recalculate();
		// this.recalculateTotalPlusMarkUp();
	}

	private deactiveTextToCardIfNoCardInOrder(basketId: number) {
		console.log("WWW" + basketId);//todo magic
		if (basketId == 187 || basketId == 188) {
			let isAnyCardInOrder = this.orderItems.find(data => data.basket.basketId == 187 || data.basket.basketId == 188);
			if (!isAnyCardInOrder) {
				this.isTextToCardVisible = false;
				this.order.textToCard = null;
			}
		}
	}

	recalculate() {
		this.total = 0;
		this.orderItems.forEach(orderItem => {
			this.total += (orderItem.basket.basketTotalPrice * orderItem.quantity);
		})
	}

	getFile(id: number) {
		this.fileSendService.getFile(id).subscribe(res => {
			let a = document.createElement("a")
			let blobURL = URL.createObjectURL(res);
			a.download = this.fileSendService.fileName;
			a.href = blobURL
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
		});
	}

	deleteFile(id: number) {
		this.fileSendService.deleteFile(id).subscribe(res => {
			this.refreshFileList();
		})
	}
	cleanLoyaltyUser(){
		this.order.loyaltyUser = null;
	}

	pickLoyaltyUser(user){

		this.order.loyaltyUser = user;
		this.loyaltyProgramUserPanelShow = false;
	}

	prepereLoyaltyUserPanel(){

		this.loyaltyProgramUserPanelShow = true;

		this.userService.getProgramUsers().subscribe(data =>{
			this.programUsers = data;
		} )

	}

	cleanAddress() {
		this.orderAddress = new Address();
	}

	editAddressMode() {
		this.orderAddress.addressId = null;
	}

	refreshFileList() {
		setTimeout(() => {
			this.orderService.getFileList(this.orderId).subscribe(data => {
				this.fileList = data;
			});
		}, 1000);
	}

	onBeforeUpload(event) {
		let token = localStorage.getItem(TOKEN);
		event.xhr.setRequestHeader('Authorization', `Bearer ${token}`);
	}

	ShowConfirmModal(file: File) {
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz usunąć ten plik ?',
			accept: () => {
				this.fileSendService.deleteFile(file.fileId).subscribe(res => {
					this.refreshFileList();
				})
			},
			reject: () => {
			}
		});
	}

	getWeekNumber(d: Date): number {
		d = new Date(d);
		d.setHours(0, 0, 0);
		d.setDate(d.getDate() + 4 - (d.getDay() || 7));
		var yearStart = new Date(d.getFullYear(), 0, 1);
		var weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
		return weekNo
	}

	OnWeekOfYearDateChange() {
		this.weekOfYear = this.getWeekNumber(this.weekOfYearTmp)
		this.isDeliveryWeekValid();
	}

	isDeliveryWeekValid() {
		let weekOfYearFromOrderDate = this.getWeekNumber(this.order.orderDate);
		if (weekOfYearFromOrderDate > this.weekOfYear) {
			this.isDeliveryWeekDateValid = false
		} else {
			this.isDeliveryWeekDateValid = true
		}
	}

	onDeliveryDataChange() {
		var tmpDeliveryDate = new Date(this.order.deliveryDate);
		tmpDeliveryDate.setHours(23, 59, 59, 99);
		if (tmpDeliveryDate > this.order.orderDate) {
			this.isDeliveryDateValid = true
		} else {
			this.isDeliveryDateValid = false
		}
	}

	goToAuditPage(event) {
		let orderId = event.data.orderId;
		let revId = event.data.revId;
		this.router.navigate(['orders/audit', {revId: revId, orderId: orderId}]);
	}
}
