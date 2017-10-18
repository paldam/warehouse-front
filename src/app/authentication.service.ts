import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Http, Response} from '@angular/http';
import {Router} from "@angular/router";

export const TOKEN: string = 'jwt_token';
export const TOKEN_USER: string = 'jwt_token_user';


@Injectable()
export class AuthenticationService {


    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;

    public id_token: string;

    constructor(private http: Http,private router: Router) {

        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;


        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem(TOKEN_USER));
        this.id_token = currentUser && currentUser.token;
    }

    login(username: string, password: string): Observable<boolean> {
        const data = {
            username: username,
            password: password
        };
        return this.http.post(this.baseUrl + `/auth`, data).map((response: Response) =>{
            let token = response.json() && response.json().id_token;  //id_token - name from response
            if (token) {
                this.id_token=token;
                localStorage.setItem(TOKEN,token);
                localStorage.setItem(TOKEN_USER, username);
                return true;
            }else{
                return false;
            }

        })

    }


    logout(): void {
        // clear token remove user from local storage to log user out
        this.id_token = null;
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(TOKEN_USER);
    }
}