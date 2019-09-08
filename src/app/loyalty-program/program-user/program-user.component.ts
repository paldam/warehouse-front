import {Component, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {User} from "../../model/user.model";
import {AppConstans} from "../../constans";
import {AuthenticationService} from "../../authentication.service";
import {NgForm} from "@angular/forms";
import {Supplier} from "../../model/supplier.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";

@Component({
	selector: 'app-program-user',
	templateUrl: './program-user.component.html',
	styleUrls: ['./program-user.component.css']
})
export class ProgramUserComponent implements OnInit {
	public loading: boolean;
	public programUsers: User [] = [];
	public paginatorValues = AppConstans.PAGINATOR_VALUES;
	public showAddUserModal: boolean = false;
	public formSubmitted: boolean = false;
	public userToAdd: User = new User();

	constructor(private userService: UserService, private authenticationService: AuthenticationService, public  messageServiceExt: MessageServiceExt) {
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
}
