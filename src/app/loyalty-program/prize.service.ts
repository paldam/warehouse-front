import {HttpService} from "../http-service";
import {Basket} from "../model/basket.model";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {OrderItem} from "../model/order_item";
import {Injectable} from "@angular/core";
import {Order} from "../model/order.model";
import {Prize} from "../model/prize";
import {BasketExt} from "../model/BasketExt";

@Injectable()
export class PrizeService {
	public protocol: string = "http";
	public port: number = 8080;
	public baseUrl: string;

	public constructor(private http: HttpService) {
		this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
	}

	getPrizeOrders(): Observable<Response> {
		return this.http.get(this.baseUrl + `/prize/orders`)
			.map((response: Response) => response.json());
	}

	getPrizeOrder(id: number): Observable<Order> {
		return this.http.get(this.baseUrl + `/prize/order/${id}`)
			.map((response: Response) =>
				response.json());
	}

	changeOrderStatus(orderId: number, statusId: number): Observable<Response> {
		return this.http.post(this.baseUrl + `/prize/order/status/${orderId}/${statusId}`, null)
	}

	getPrize() {
		return this.http.get<Prize[]>(this.baseUrl + `/prize/prizelist`)
			.map((response: Response) =>
				response.json());
	}

	savePrize(prize: Prize, imgToUpload: any): Observable<Response> {
		var parts = [
			new Blob([imgToUpload], {type: 'image/jpeg'}),
			' Same way as you do with blob',
			new Uint16Array([33])
		];
		let f: File = new File(parts, "sds");
		const formData: FormData = new FormData();
		formData.append('prizeimage', f);
		const blobOverrides = new Blob([JSON.stringify(prize)], {
			type: 'application/json',
		});
		formData.append('prizeobject', blobOverrides);
		return this.http.post(this.baseUrl + `/prize/add`, formData)
			.map((response: Response) => response.json());
	}
}