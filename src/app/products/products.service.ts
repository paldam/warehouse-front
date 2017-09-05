import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Products} from '../model/products.model';
import {Http,Response} from "@angular/http";
import 'rxjs/add/operator/map';
@Injectable()
export class ProductsService {

  private protocol :string = "http";
  private port :number= 8080;
  private baseUrl: string;

  constructor(private http: Http) {
    this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
  }

  getProducts() : Observable<Products[]>{
    return this.http.get(`http://localhost:8080/b`)
        .map((response: Response) =>
            response.json())
  }

}
