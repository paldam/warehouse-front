import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';

@Injectable()
export class AuthGuard
	implements CanActivate {
	constructor(private router: Router, private authenticationService: AuthenticationService) {
	}

	canActivate() {
		if (this.authenticationService.isLoggedIn()) {
			return true;
		} else {
			this.router.navigateByUrl('/login');
			return false;
		}
	}
}