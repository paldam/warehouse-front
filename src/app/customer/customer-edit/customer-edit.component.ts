import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerService} from "../customer.service";
import {Customer} from "../../model/customer.model";
import {NgForm} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {AuthenticationService} from "../../authentication.service";

@Component({
	selector: 'app-customer-edit',
	templateUrl: './customer-edit.component.html',
	styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent
	implements OnInit {
	public customer: Customer = new Customer();
	public addAddressDialogShow: boolean = false;
	public changeMainAddressDialogShow: boolean = false;
	public changeCustomerDataDialogShow: boolean = false;
	public formSubmitted: boolean = false;
	public pickCityByZipCodeWindow: boolean = false;
	public tmpCityList: any[] = [];
	public selectedValue: any;
	public selectedAddr: any;
	@ViewChild('zip_code') el: any;

	constructor(private router: Router, private customerService: CustomerService, activeRoute: ActivatedRoute, private messageService: MessageService,
				private confirmationService: ConfirmationService, private messageServiceExt: MessageServiceExt, private authenticationService: AuthenticationService) {
		customerService.getCustomer(activeRoute.snapshot.params["id"]).subscribe(data => {
			this.customer = data;
		})
	}

	ngOnInit() {
	}

	showChangeCustomerDataWindow() {
		this.changeCustomerDataDialogShow = true;
	}

	showSuccessMassage() {
		this.messageServiceExt.addMessage('success', 'Status', 'Poprawnie dodano adres do klienta');
	}

	clearOnCloseChangeMainAddressDialog() {
		this.selectedAddr = null;
	}

	refreshCustomerAndAddressList() {
		this.customerService.getCustomer(this.customer.customerId).subscribe(data => {
			// data.addresses.sort(this.compareAddress);
			this.customer = data;
		})
	}

	showDeleteConfirmWindow(addrId: number, customerId: number) {
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz usunąć ten adres',
			accept: () => {
				this.customerService.deleteAddress(addrId, customerId).subscribe(
					data => {
						this.refreshCustomerAndAddressList();
						this.messageServiceExt.addMessage('success', 'Status', 'Usunięto adres');
					},
					error => {
						this.messageServiceExt.addMessage('error', 'Błąd', error.text());
					});
			},
			reject: () => {
			}
		});
	}

	cancelEditCustomer() {
		this.changeCustomerDataDialogShow = false;
	}

	isAdmin(): boolean {
		return this.authenticationService.isAdmin();
	}

	goBack() {
		this.router.navigateByUrl('/customer/list');
	}

	submitEditCustomerForm(form: NgForm) {
		this.formSubmitted = true;
		if (form.valid) {
			this.customerService.saveCustomers(this.customer).subscribe(data => {
				form.reset();
				this.formSubmitted = false;
				this.changeCustomerDataDialogShow = false;
				this.messageServiceExt.addMessage("success", "Status", "Poprawnie dokonano edycji danych");
				this.refreshCustomerAndAddressList();
			}, error => {
				this.messageServiceExt.addMessage("error", "Wystąpił błąd przy edycji klienta", error.status + ' ' + error.statusText);
			});
		}
	}
}
