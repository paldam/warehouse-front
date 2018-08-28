import {Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Customer} from '../model/customer.model';
import {HttpService} from "../http-service";
import {Address} from "../model/address.model";
import {HttpParams} from "@angular/common/http";
import set = Reflect.set;


@Injectable()
export class CustomerService {

    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;

    public constructor(private http : HttpService){
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }


    getCustomers(): Observable<Customer[]> {
        return this.http.get(this.baseUrl+`/customers/`)
            .map((response: Response) => response.json());
    }

    getCustomer(id: number): Observable<Customer> {
        return this.http.get(this.baseUrl+`/customer/${id}`)
            .map((response: Response) => response.json());
    }


    saveCustomers(customer : Customer): Observable<Response> {
        return this.http.post(this.baseUrl+`/customers/`,customer)

    }

    getCustomerPrimaryAddress(customerId : number): Observable<Address> {
        return this.http.get(this.baseUrl+`/customerprimaryaddr/${customerId}`)
            .map((response: Response) => response.json());
    }

    getAllCustomerWithPrimaryAddress(): Observable<any> {
        return this.http.get(this.baseUrl+`/customersaddr/`)
            .map((response: Response) => response.json());
    }

    getCityByZipCode(code : string): Observable<any[]> {
        return this.http.get(this.baseUrl+`/zipcode/${code}`)
            .map((response: Response) => response.json());
    }


    deleteAddress(id : number, customerId: number): Observable<Response> {
        return this.http.delete(this.baseUrl+`/address/`,{
            params: {
                id: id,
                customerId: customerId
            }} )
    }


    changeMainAddr(customerId: number,id : number): Observable<Response> {

        return this.http.delete(this.baseUrl+`/primaryaddress/`,{
            params: {
                id: id,
                customerId: customerId
            }} )
    }

    deleteCustomer(id: number): Observable<Response> {
        return this.http.delete(this.baseUrl+`/customer/${id}`)


    }





}