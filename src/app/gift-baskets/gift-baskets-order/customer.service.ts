import {Http,Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Customer} from '../../model/customer.model';


@Injectable()
export class CustomerService {

    private protocol: string = "http";
    private port: number = 8080;
    private baseUrl: string;

    public constructor(private http : Http){
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }


    getCustomers(): Observable<Customer[]> {
        return this.http.get(this.baseUrl+`/customers/`)
            .map((response: Response) => response.json());
    }

}

