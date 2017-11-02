import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthenticationService} from "./authentication.service";
@Injectable()
export class AdminOrSuperUserGuard implements CanActivate {


    constructor(private router: Router, private authenticationService :AuthenticationService) { }

    canActivate() {
        if (this.authenticationService.isAdmin()||this.authenticationService.isSuperUser()) {
            return true;

        }else{
            this.router.navigateByUrl('/login');
            return false;
        }

    }
}