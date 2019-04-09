import { Injectable } from '@angular/core';
import {HttpService} from "../http-service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;

    public constructor(private http : HttpService){
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }


    resetProductsStates(): Observable<Response> {
        return this.http.post(this.baseUrl+`/products/supplier`,null)

    }

}
