import {Http,Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Basket} from '../model/basket.model';
import {BasketType} from '../model/basket_type.model';

@Injectable()
export class BasketService {

    private protocol: string = "http";
    private port: number = 8080;
    private baseUrl: string;

    public constructor(private http : Http){
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }


    saveBasket(basket: Basket): Observable<Response> {
        return this.http.post(this.baseUrl+`/baskets/`, basket)
       .map((response: Response) => response.json());

    }

    getBaskets(): Observable<Basket[]> {
        return this.http.get(this.baseUrl+`/baskets/`)
            .map((response: Response) => response.json());
    }

    getBasketsTypes(): Observable<BasketType[]> {
        return this.http.get(this.baseUrl+`/baskets/types`)
            .map((response: Response) => response.json());
    }
}


