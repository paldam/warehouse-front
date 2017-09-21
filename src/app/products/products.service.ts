import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Products} from '../model/products.model';
import {HttpModule, Http,Response,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {ProductType} from '../model/product_type.model';
@Injectable()
export class ProductsService {

  private protocol: string = "http";
  private port: number = 8080;
  private baseUrl: string;

  constructor(private http: Http) {
    this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
  }


  getProducts(): Observable<Products[]> {
    return this.http.get(`http://localhost:8080/products`)
        .map((response: Response) =>
            response.json());
  }
  getProduct(id: number): Observable<Products> {
    return this.http.get(`http://localhost:8080/products/${id}`)
        .map((response: Response) =>
            response.json());
  }

  getProductsTypes(): Observable<ProductType[]> {
    return this.http.get(`http://localhost:8080/products/types`)
        .map((response: Response) =>
            response.json());
  }

  saveProduct(product: Products): Observable<Response> {
    return this.http.post(`http://localhost:8080/products/`, product)
        //.map((response: Response) => response.json());

  }
}
