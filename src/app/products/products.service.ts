import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Product} from '../model/product.model';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {ProductType} from '../model/product_type.model';
import {HttpService} from "../http-service";
@Injectable()
export class ProductsService {

  public protocol: string = "http";
  public port: number = 8080;
  public baseUrl: string;

  constructor(private http: HttpService) {
    this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
  }


  getProducts(): Observable<Product[]> {
    return this.http.get(this.baseUrl+`/products`)
        .map((response: Response) =>
            response.json());
  }
  getProduct(id: number): Observable<Product> {
    return this.http.get(this.baseUrl+`/products/${id}`)
        .map((response: Response) =>
            response.json());
  }

  getProductsTypes(): Observable<ProductType[]> {
    return this.http.get(this.baseUrl+`/products/types`)
        .map((response: Response) =>
            response.json());
  }

  saveProduct(product: Product): Observable<Response> {
    return this.http.post(this.baseUrl+`/products/`, product)
        //.map((response: Response) => response.json());
  }

  deleteProduct(id: number): Observable<Response>{
    return this.http.delete(this.baseUrl+`/products/${id}`)
  }
}
