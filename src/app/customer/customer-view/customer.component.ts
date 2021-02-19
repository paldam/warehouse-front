import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CustomerService} from "../customer.service";
import {OrderService} from "../../order/order.service";
import {Order} from "../../model/order.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {ConfirmationService} from "primeng/api";
import {AuthenticationService} from "../../authentication.service";
import {AppConstants} from "../../constants";
import {NavigationEnd, Router} from "@angular/router";
import {RoutingState} from "../../routing-stage";
import {Customer} from "../../model/customer.model";
import {DataTable} from "primeng/primeng";

@Component({
	selector: 'app-customer',
	templateUrl: './customer.component.html',
	styleUrls: ['./customer.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class CustomerComponent
	implements OnInit {
	public loading: boolean = false;
	public customersList: any[] = [];
	public allOrdersByCustomerList: Order[] = [];
	public lastPaginationPageNumberOnCustomerViewPage: number = 0;
	public selectedValue: any;
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	public findInputtext: string = '';
	public routerObserver = null;
	@ViewChild('dt') datatable: DataTable;

	constructor(private customerService: CustomerService, private  orderService: OrderService, private messageServiceExt: MessageServiceExt,
				private confirmationService: ConfirmationService, private authenticationService: AuthenticationService, public router: Router, private routingState: RoutingState) {
		customerService.getCustomers().subscribe(data => {
			this.customersList = data;
		})
	}

	ngOnInit() {
		this.checkIfUpdateOrderRowAfterRedirectFromOrderDetails()
	}

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.customerService.getCustomers().subscribe(data => {
				this.customersList = data;
			});
			this.loading = false;
			this.cleanFilter();
		}, 1000);
	}

	private cleanFilter(){
		this.findInputtext='';
	}

	private checkIfUpdateOrderRowAfterRedirectFromOrderDetails() {
		this.routerObserver = this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				if (this.routingState.getPreviousUrl().substr(0, 17) == '/customer/detail/') {
					if (localStorage.getItem('lastPaginationPageNumberOnCustomerViewPage')) {
						let tmplastVisitedPage = parseInt(localStorage.getItem('lastPaginationPageNumberOnCustomerViewPage'));
						this.lastPaginationPageNumberOnCustomerViewPage = (tmplastVisitedPage - 1) * 50;
						console.log(this.lastPaginationPageNumberOnCustomerViewPage);
					} else {
						this.lastPaginationPageNumberOnCustomerViewPage = 0;
					}
					let id = parseInt(this.routingState.getPreviousUrl().substr(17, this.routingState.getPreviousUrl().length));
					this.refreshCustomerRowInDataTable(id);
				}
			}
		})
	}

	private goToSavedScrollPosition() {
		window.scrollTo(0, this.routingState.getlastScrollYPosition());
	}

	private refreshCustomerRowInDataTable(id: number) {
		this.customerService.getCustomer(id).subscribe(data => {
			let index = this.customersList.findIndex((value: Customer) => {
				return value.customerId == id;
			});
			this.customersList[index] = data;
			this.customersList = this.customersList.slice(); //Tip to refresh PrimeNg datatable
		}, error => {
		}, () => {
			this.goToSavedScrollPosition();
			setTimeout(() => {
				this.datatable.first = this.lastPaginationPageNumberOnCustomerViewPage;
			}, 150);
		})
	}

	getOrdersByCustomer(id: number) {
		this.orderService.getOrderByCustomer(id).subscribe(data => {
			this.allOrdersByCustomerList = data;
		})
	}

	// goToEditPageFromDoubleclick(event) {
	// 	let index = this.customersList.findIndex((value: Customer) => {
	// 		return value.customerId == event.data.customerId;
	// 	});
	// 	let pageTmp = ((index) / 50) + 1;
	// 	localStorage.setItem('lastPaginationPageNumberOnCustomerViewPage', pageTmp.toString());
	// 	this.router.navigate(["/customer/detail/", event.data.customerId]);
	// 	this.routingState.setlastScrollYPosition(window.scrollY);
	//}
	goToEditPage(index, id) {
		let pageTmp = ((index - 1) / 50) + 1;
		localStorage.setItem('lastPaginationPageNumberOnCustomerViewPage', pageTmp.toString());
		this.router.navigate(["/customer/detail", id]);
		this.routingState.setlastScrollYPosition(window.scrollY);
	}

	showDeleteConfirmWindow(customerId: number) {
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz usunąć tego klienta ?',
			accept: () => {
				this.customerService.deleteCustomer(customerId).subscribe(
					data => {
						console.log("odpowipedz" + data);
						this.messageServiceExt.addMessage('success', 'Status', 'Usunięto klienta');
						this.refreshData();
					},
					error => {
						this.messageServiceExt.addMessage('error', 'Błąd', error.text());
					});
			},
			reject: () => {
			}
		});
	}
}
