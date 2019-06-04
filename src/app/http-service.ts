import {Injectable} from '@angular/core';
import {XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {TOKEN, TOKEN_USER} from './authentication.service';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {MessageServiceExt} from "./messages/messageServiceExt";


@Injectable()

export class HttpService extends Http {

    constructor (backend: XHRBackend, options: RequestOptions,private router: Router,private messageService: MessageService, private messageServiceExt: MessageServiceExt) {
        super(backend, options);
        let token = localStorage.getItem(TOKEN);
        options.headers.set('Authorization', `Bearer ${token}`);


    }

    request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
        let token = localStorage.getItem(TOKEN);
        if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
            if (!options) {
                // let's make option object
                options = {headers: new Headers()};
            }
            options.headers.set('Authorization', `Bearer ${token}`);
        } else {
            // we have to add the token to the url object
            url.headers.set('Authorization', `Bearer ${token}`);
        }
        return super.request(url, options).catch(this.catchAuthError(this));
    }

    private catchAuthError (self: HttpService) {
        // we have to pass HttpService's own instance here as `self`
        return (res: Response) => {
            
            console.log("TTTTTTTTT");

			if (res.status === 400) {

				this.messageServiceExt.addMessage('error', 'Błąd ', "Status: " + res.status + ' ' + res.text());
			}
            if (res.status === 401) {
                // if not authenticated
                this.router.navigateByUrl('/login');

                localStorage.removeItem(TOKEN);
                localStorage.removeItem(TOKEN_USER);
            }if (res.status === 500 ) {


                this.messageService.add({severity: 'error', summary: 'Wystpiął Błąd', detail: "Problem z połączeniem sieciowym lub bazą danych", life: 8000
                });

            }
            return Observable.throw(res);
        };
    }




}