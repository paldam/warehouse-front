import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProductsService} from "../products.service";
import {AuthenticationService} from "../../authentication.service";
import {Supplier} from "../../model/supplier.model";
import {CoreDataTableViewComponent} from "../../coreViewComponent";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {ConfirmationService} from "primeng/api";
import {NgForm} from "@angular/forms";

@Component({
	selector: 'app-suppliers',
	templateUrl: './suppliers.component.html',
	styleUrls: ['./suppliers.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class SuppliersComponent
	extends CoreDataTableViewComponent
	implements OnInit {
	public suppliers: Supplier [] = [];
	public addSupplierDialogShow: boolean = false;
	public supplierToCreate: Supplier = new Supplier();
	public tmpSupplierName: string;
	public formSubmitted: boolean = false;
	@ViewChild('supplier_name') formSupplierNameInputField: any;

	constructor(private productsService: ProductsService, public authenticationService: AuthenticationService,
                public messageServiceExt: MessageServiceExt, private confirmationService: ConfirmationService) {
		super();
		productsService.getSuppliers().subscribe(data => this.suppliers = data);
	}

	ngOnInit() {
	}

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.productsService.getSuppliers().subscribe(data => this.suppliers = data);
			this.loading = false;
		}, 1000);
	}

	editSupplier(supplier) {
		this.productsService.saveSupplier(supplier).subscribe(
			value => {
				this.refreshData();
				this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji nazwy', 5000);
			},
			error => {
				this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ', 5000);
			}
		)
	}

	addSupplierShow() {
		this.addSupplierDialogShow = true;
	}

	addSupplier(form: NgForm) {
		this.formSubmitted = true;
		if (this.supplierToCreate.supplierName.length > 0) {
			this.productsService.saveSupplier(this.supplierToCreate).subscribe(
				value => {
					this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dodano dostawcę', 5000);
				}, error => {
					this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ', 5000);
				});
			this.formSubmitted = false;
			this.supplierToCreate = new Supplier();
			this.tmpSupplierName = "";
			this.addSupplierDialogShow = false;
			this.refreshData();
			form.resetForm();
		}
	}

	closeSupplierAddDialog() {
		this.addSupplierDialogShow = false;
	}

	deleteSupplier(supplier: Supplier) {
		this.confirmationService.confirm({
			key: "resetSupplier",
			message: 'Jesteś pewny że chcesz usunąć tego dostawcę  ?',
			accept: () => {
				this.productsService.deleteSupplier(supplier.supplierId).subscribe(
					data => {
						this.messageServiceExt.addMessageWithTime('success', 'Status', 'Usunięto dostawcę', 5000);
						this.refreshData();
					},
					error => {
						this.messageServiceExt.addMessageWithTime('error', 'Błąd', 'Nie można usunac tego dostawcy ', 5000);
					}
				)
			},
			reject: () => {
			}
		});
	}
}
