import {Injectable} from '@angular/core';
import {Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {TOKEN, TOKEN_USER} from './authentication.service';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {MessageServiceExt} from "./messages/messageServiceExt";

@Injectable()
export class HttpService
	extends Http {
	constructor(backend: XHRBackend, options: RequestOptions, private router: Router, private messageService: MessageService, private messageServiceExt: MessageServiceExt) {
		super(backend, options);
		let token = localStorage.getItem(TOKEN);
		options.headers.set('Authorization', `Bearer ${token}`);
	}

	request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
		let token = localStorage.getItem(TOKEN);
		if (typeof url === 'string') {
			if (!options) {
				options = {headers: new Headers()};
			}
			options.headers.set('Authorization', `Bearer ${token}`);
		} else {
			url.headers.set('Authorization', `Bearer ${token}`);
		}
		return super.request(url, options).catch(this.catchAuthError(this));
	}

	private catchAuthError(self: HttpService) {
		return (res: Response) => {
			if (res.status === 400) {
				this.messageServiceExt.addMessage('error', 'Błąd ', "Status: " + res.status + ' ' + res.text());
				console.log(res);
			}
			if (res.status === 401) {
				this.router.navigateByUrl('/login');
				localStorage.removeItem(TOKEN);
				localStorage.removeItem(TOKEN_USER);
			}
			if (res.status === 500) {
				this.messageService.add({
					severity: 'error',
					summary: 'Wystpiął Błąd',
					detail: "Problem z połączeniem sieciowym lub bazą danych",
					life: 8000
				});
			}
			return Observable.throw(res);
		};
	}
}