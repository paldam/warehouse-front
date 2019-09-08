import {HttpService} from "../http-service";
import {Basket} from "../model/basket.model";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {OrderItem} from "../model/order_item";
import {Injectable} from "@angular/core";
import {Order} from "../model/order.model";

@Injectable()
export class PrizeService {
	public protocol: string = "http";
	public port: number = 8080;
	public baseUrl: string;

	public constructor(private http: HttpService) {
		this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
	}




	getPrizeOrders() :Observable<Response> {
		return this.http.get(this.baseUrl + `/prize/orders`)
			.map((response: Response) => response.json());
	}


	getPrizeOrder(id: number): Observable<Order>{
		return this.http.get(this.baseUrl+`/prize/order/${id}`)
			.map((response: Response) =>
				response.json());
	}

	changeOrderStatus(orderId: number, statusId: number): Observable<Response>{
		return this.http.post(this.baseUrl+`/prize/order/status/${orderId}/${statusId}`,null)

	}

}