import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthenticationService, TOKEN_USER} from './authentication.service';
import { JwtHelper } from 'angular2-jwt';
@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private router: Router, private authenticationService :AuthenticationService) { }

    canActivate() {
        if (this.authenticationService.isLoggedIn()) {
            return true;
        }else{
            this.router.navigateByUrl('/login');
            return false;
        }

    }
}