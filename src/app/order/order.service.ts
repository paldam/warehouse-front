
import {Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Order} from '../model/order.model';
import {DeliveryType} from '../model/delivery_type.model';
@Injectable()
export class OrderService {

    private protocol: string = "http";
    private port: number = 8080;
    private baseUrl: string;

    public constructor(private http: Http) {
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }


    saveOrder(order: Order): Observable<Response> {
        return this.http.post(this.baseUrl + `/orders/`, order)
        //.map((response: Response) => response.json());
    }
    getDeliveryTypes() :Observable<DeliveryType[]>{
        return this.http.get(this.baseUrl+`/delivery/types`)
            .map((response: Response) =>
                response.json());
    }

    getOreders(): Observable<Order[]>{
        return this.http.get(this.baseUrl+`/orders/`)
            .map((response: Response) =>
                response.json());
    }

}