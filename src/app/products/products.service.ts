import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Product} from '../model/product.model';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {ProductType} from '../model/product_type.model';
import {HttpService} from "../http-service";
import {Supplier} from "../model/supplier.model";

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

  getProductsBySupplier(id: number): Observable<Product[]> {
    return this.http.get(this.baseUrl+`/productsbysupplier/${id}`)
        .map((response: Response) =>
            response.json());
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get(this.baseUrl+`/products/supplier`)
        .map((response: Response) =>
            response.json());
  }

  saveSupplier(supplier: Supplier): Observable<Response> {
    return this.http.post(this.baseUrl+`/products/supplier/`, supplier)
    //.map((response: Response) => response.json());
  }


  changeStockEndResetOfProductsToDelivery(id: number , value: number): Observable<Response> {


    return this.http.post(this.baseUrl+`/product/stock/`,null,{
      params: {
        productId: id,
        addValue: value
      }} )
  }


    // resetNumberOfProductsToDelivery(id: number ): Observable<Response> {
    //
    //
    //     return this.http.post(this.baseUrl+`/product/order/reset/`,null,{
    //         params: {
    //             productId: id,
    //         }} )
    // }

    addNumberOfProductsDelivery(id: number , value: number): Observable<Response> {


        return this.http.post(this.baseUrl+`/product/order/`,null,{
            params: {
                productId: id,
                addValue: value
            }} )
    }


  getProductsToOrder(startDate , endDate): Observable<any[]> {
    return this.http.get(this.baseUrl+`/orders/products_to_order/daterange?startDate=${startDate}&endDate=${endDate}`)
        .map((response: Response) =>
            response.json());
  }




    getProductsToOrderWithoutDeletedByDeliveryDate(startDate , endDate): Observable<any[]> {
        return this.http.get(this.baseUrl+`/orders/products_to_order_without_deleted_by_delivery_date/daterange?startDate=${startDate}&endDate=${endDate}`)
            .map((response: Response) =>
                response.json());
    }

    getProductsToOrderWithoutDeletedByOrderDate(startDate , endDate): Observable<any[]> {
        return this.http.get(this.baseUrl+`/orders/products_to_order_without_deleted_by_order_date/daterange?startDate=${startDate}&endDate=${endDate}`)
            .map((response: Response) =>
                response.json());
    }

  getProduct(id: number): Observable<Product> {
    return this.http.get(this.baseUrl+`/products/${id}`)
        .map((response: Response) =>
            response.json());
  }

  getBasketsContainSpecyficProduct(id: number){
      return this.http.get(this.baseUrl+`/baskets_by_product/${id}`)
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
