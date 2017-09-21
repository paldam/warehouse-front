import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Product} from '../model/product.model';
import {Http,Response} from '@angular/http';
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


  getProducts(): Observable<Product[]> {
    return this.http.get(`http://localhost:8080/products`)
        .map((response: Response) =>
            response.json());
  }
  getProduct(id: number): Observable<Product> {
    return this.http.get(`http://localhost:8080/products/${id}`)
        .map((response: Response) =>
            response.json());
  }

  getProductsTypes(): Observable<ProductType[]> {
    return this.http.get(`http://localhost:8080/products/types`)
        .map((response: Response) =>
            response.json());
  }

  saveProduct(product: Product): Observable<Response> {
    return this.http.post(`http://localhost:8080/products/`, product)
        //.map((response: Response) => response.json());

  }
}
