import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TOKEN_USER } from './authentication.service';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem(TOKEN_USER)) {
            return true;
        }

        this.router.navigateByUrl('login')
        return false;
    }
}