import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../authentication.service";

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent
	implements OnInit {
	model: any = {};
	loading = false;
	error = '';

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService) {
	}

	ngOnInit() {
		this.authenticationService.logout();
	}

	login() {
		this.loading = true;
		this.authenticationService.login(this.model.username, this.model.password)
			.subscribe(result => {
				if (result === true) {
					if (this.authenticationService.isAdmin()) {
						this.router.navigate(['/orders/baskets']);
					} else if (this.authenticationService.isProdukcjaUser()) {
						this.router.navigate(['/orders/production']);
					} else {
						this.router.navigate(['/orders/all']);
					}
				} else {
					this.error = 'Błąd wewnętrzny';
					this.loading = false;
				}
			}, (err: Response) => {
				this.error = 'Login lub hasło jest nie poprawne';
				this.loading = false;
			});
	}
}