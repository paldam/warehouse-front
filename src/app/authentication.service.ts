import {Observable} from "rxjs/Observable";
import {EventEmitter, Injectable, Output} from "@angular/core";
import {Http, Response} from '@angular/http';
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
export const TOKEN: string = 'jwt_token';
export const TOKEN_USER: string = 'jwt_token_user';
const jwtHelperService = new JwtHelperService();

@Injectable()
export class AuthenticationService {
	public protocol: string = "http";
	public port: number = 8080;
	public baseUrl: string;
	public id_token: string;

	constructor(private http: Http, private router: Router) {
		this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
		this.id_token = localStorage.getItem(TOKEN);
	}

	@Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

	login(username: string, password: string): Observable<boolean> {
		const data = {
			username: username,
			password: password
		};
		return this.http.post(this.baseUrl + `/auth`, data).map((response: Response) => {
			let token = response.json() && response.json().id_token;
			if (token) {
				this.id_token = token;
				localStorage.setItem(TOKEN, token);
				localStorage.setItem(TOKEN_USER, username);
				this.getLoggedInName.emit(this.getCurrentUser());
				return true;
			} else {
				this.getLoggedInName.emit("wylogowano");
				return false;
			}
		})
	}

	logout(): void {
		this.id_token = null;
		localStorage.removeItem(TOKEN);
		localStorage.removeItem(TOKEN_USER);
		this.getLoggedInName.emit("wylogowano");
	}

	isLoggedIn(): boolean {
		return !jwtHelperService.isTokenExpired(this.id_token);
	}

	isAdmin(): boolean {
		if (localStorage.getItem(TOKEN)) {
			let authority = jwtHelperService.decodeToken(this.id_token).auth;
			return authority == "admin";
		}
	}

	isUser(): boolean {
		if (localStorage.getItem(TOKEN)) {
			let authority = jwtHelperService.decodeToken(this.id_token).auth;
			return authority == "user";
		}
	}

	isBiuroUser(): boolean {
		if (localStorage.getItem(TOKEN)) {
			let authority = jwtHelperService.decodeToken(this.id_token).auth;
			return authority == "biuro";
		}
	}

	isMagazynUser(): boolean {
		if (localStorage.getItem(TOKEN)) {
			let authority = jwtHelperService.decodeToken(this.id_token).auth;
			return authority == "magazyn";
		}
	}

	isProdukcjaUser(): boolean {
		if (localStorage.getItem(TOKEN)) {
			let authority = jwtHelperService.decodeToken(this.id_token).auth;
			return authority == "produkcja";
		}
	}

	isWysylkaUser(): boolean {
		if (localStorage.getItem(TOKEN)) {
			let authority = jwtHelperService.decodeToken(this.id_token).auth;
			return authority == "wysylka";
		}
	}

	isSuperUser(): boolean {
		if (localStorage.getItem(TOKEN)) {
			let authority = jwtHelperService.decodeToken(this.id_token).auth;
			return authority == "super-user";
		}
	}

	getCurrentUser() {
		if (localStorage.getItem(TOKEN)) {
			return jwtHelperService.decodeToken(this.id_token).sub;
		}
	}
}