import {Http,Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Customer} from '../../model/customer.model';


@Injectable()
export class CustomerService {

    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;

    public constructor(private http : Http){
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }


    getCustomers(): Observable<Customer[]> {
        return this.http.get(this.baseUrl+`/customers/`)
            .map((response: Response) => response.json());
    }

}

