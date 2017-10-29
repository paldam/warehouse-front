
import {Response} from '@angular/http';
import {Injectable} from "@angular/core";
import {HttpService} from "./http-service";
import {Observable} from "rxjs/Observable";
import {User} from "./model/user.model";
import {Authorities} from "./model/authorities.model";
@Injectable()
export class UserService {

    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;

    constructor(private http: HttpService) {
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }

    getUsers(): Observable<User[]> {
        return this.http.get(this.baseUrl+`/users`)
            .map((response: Response) =>
                response.json());
    }

    getAuthorities(): Observable<Authorities[]> {
        return this.http.get(this.baseUrl+`/users/authorities`)
            .map((response: Response) =>
                response.json());
    }

    saveUser(user: User): Observable<Response> {
        return this.http.post(this.baseUrl+`/users/`, user)
        //.map((response: Response) => response.json());
    }
    public updateUser(user: User): Observable<Response> {
        return this.http.put(this.baseUrl+`/users/`, user)
        //.map((response: Response) => response.json());
    }
    deleteUser(login : string): Observable<Response> {
        return this.http.delete(this.baseUrl+`/users/${login}`)
        //.map((response: Response) => response.json());
    }
    resetPassword(login : string): Observable<Response> {
        return this.http.put(this.baseUrl+`/users/reset/${login}`,login)
        //.map((response: Response) => response.json());
    }
}

