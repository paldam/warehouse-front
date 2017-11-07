import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http,Headers, RequestOptions} from "@angular/http";
import {Order} from "../model/order.model";

@Injectable()
export class MapService {

    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;

    constructor(private http: Http) {
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }

    getGeolocation(address: string): Observable<any> {
        let myHeaders = new Headers();
        myHeaders.delete('Authorization')
        let options = new RequestOptions({headers:myHeaders});

        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&sensor=false&key=AIzaSyBdxjMxuTAKacU8S50s8AuVosAW-VN2yO4`,options)
            .map((response: any) =>
                response.json());
    }

    getOrdersByDateRange(startDate , endDate): Observable<Order[]> {
        return this.http.get(this.baseUrl+`/orders/daterange?startDate=${startDate}&endDate=${endDate}`)
            .map((response) => response.json());
    }



}

