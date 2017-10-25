import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Http, Response} from '@angular/http';
import {Router} from "@angular/router";
import { JwtHelper } from 'angular2-jwt';
import { tokenNotExpired } from 'angular2-jwt';

export const TOKEN: string = 'jwt_token';
export const TOKEN_USER: string = 'jwt_token_user';


@Injectable()
export class AuthenticationService {


    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;
    public jwtHelper: JwtHelper = new JwtHelper();

    public id_token: string;

    constructor(private http: Http,private router: Router) {

        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;


        // set token if saved in local storage
        var currentUser = localStorage.getItem(TOKEN_USER);
        this.id_token = localStorage.getItem(TOKEN);
    }

    login(username: string, password: string): Observable<boolean> {
        const data = {
            username: username,
            password: password
        };
        return this.http.post(this.baseUrl + `/auth`, data).map((response: Response) =>{
            let token = response.json() && response.json().id_token;
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
        this.id_token = null;
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(TOKEN_USER);
    }

    isLoggedIn() : boolean{
            return tokenNotExpired('jwt_token');
    }

    isAdmin() : boolean {
        if (localStorage.getItem(TOKEN))  {
            let authority = this.jwtHelper.decodeToken(this.id_token).auth;

            if (authority == "admin"){
                return true;
            }else{
                return false;
            }
        }
    }

    getCurrentUser(){
        if (localStorage.getItem(TOKEN))  {
            return this.jwtHelper.decodeToken(this.id_token).sub;
        }
    }
}