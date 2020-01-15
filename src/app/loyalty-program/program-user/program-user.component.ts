import {Component, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {User} from "../../model/user.model";
import {AppConstants} from "../../constans";
import {AuthenticationService} from "../../authentication.service";
import {NgForm} from "@angular/forms";
import {Supplier} from "../../model/supplier.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {Basket} from "../../model/basket.model";
import {BasketType} from "../../model/basket_type.model";
import {ConfirmationService} from "primeng/api";

@Component({
	selector: 'app-program-user',
	templateUrl: './program-user.component.html',
	styleUrls: ['./program-user.component.css']
})
export class ProgramUserComponent implements OnInit {
	public loading: boolean;
	public programUsers: User [] = [];
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	public showAddUserModal: boolean = false;
	public formSubmitted: boolean = false;
	public userToAdd: User = new User();

	constructor(private userService: UserService, private authenticationService: AuthenticationService, public  messageServiceExt: MessageServiceExt,private confirmationService: ConfirmationService) {
		userService.getProgramUsers().subscribe(data => {
			this.programUsers = data
		})
	}

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.userService.getProgramUsers().subscribe(data => this.programUsers = data);
			this.loading = false;
		}, 1000);
	}

	ngOnInit() {
	}

	addUser(form: NgForm) {
		this.formSubmitted = true;
		if (this.userToAdd.login.length > 0) {
			this.userService.saveProgramUser(this.userToAdd).subscribe(
				value => {
					this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dodano użytkownika', 5000);
					this.showAddUserModal = false;
					this.userToAdd = new User();
					form.resetForm();
					this.refreshData();
					this.formSubmitted = false;
				}, error => {
					this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ', 5000);
				});


		}
	}

	editProgramUser(user){

		this.userService.simpleEditUser(user).subscribe(
			value => {
				this.refreshData();
				this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji',5000);
			},
			error => {
				this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ',5000  );
			}
		)

	}

	ShowConfirmModal(user: User) {
		console.log(user);
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz trwale usunąć tego użytkownika ? ',
			accept: () => {
				this.userService.deleteProgramUser(user.login).subscribe(value => {
					this.messageServiceExt.addMessageWithTime('success', 'Status', 'Usunięto użytkownika', 5000);
					this.refreshData();
				},error1 => {
					this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error1._body + ' ', 5000);

				})
			},
			reject: () => {
			}
		});
	}

}
