import {HttpService} from "../http-service";
import {Basket} from "../model/basket.model";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {OrderItem} from "../model/order_item";
import {Injectable} from "@angular/core";
import {Order} from "../model/order.model";
import {Prize} from "../model/prize";
import {BasketExt} from "../model/BasketExt";
import {Supplier} from "../model/supplier.model";
import {PointScheme} from "../model/point-scheme.model";

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

	changePrizeStatus(prizeId: number, isAve: boolean): Observable<Response> {
		return this.http.post(this.baseUrl + `/prize/status/${prizeId}/${isAve}`, null)
	}

	getPrize() {
		return this.http.get(this.baseUrl + `/prize/prizelist`)
			.map((response: Response) =>
				response.json());
	}


	getPointScheme() {
		return this.http.get(this.baseUrl + `/prize/pointscheme`)
			.map((response: Response) =>
				response.json());
	}
	savePointScheme(pointScheme: PointScheme): Observable<Response> {
		return this.http.post(this.baseUrl+`/prize/pointscheme/add`, pointScheme)
		//.map((response: Response) => response.json());
	}

	savePrizeNoImg(prize: Prize): Observable<Response> {
		return this.http.post(this.baseUrl+`/prize/add/noimg`, prize)
		//.map((response: Response) => response.json());
	}

	savePrize(prize: Prize, imgToUpload: File): Observable<Response> {

		const formData: FormData = new FormData();
		formData.append('prizeimage', imgToUpload, imgToUpload.name);


		console.log(prize);
		
		const blobOverrides = new Blob([JSON.stringify(prize)], {
			type: 'application/json',
		});
		formData.append('prizeobject', blobOverrides);
		return this.http.post(this.baseUrl + `/prize/add`, formData)
			.map((response: Response) => response.json());
	}

	editPrize(prize: Prize, imgToUpload: File): Observable<Response> {

		const formData: FormData = new FormData();
		formData.append('prizeimage', imgToUpload, imgToUpload.name);



		const blobOverrides = new Blob([JSON.stringify(prize)], {
			type: 'application/json',
		});
		formData.append('prizeobject', blobOverrides);
		return this.http.post(this.baseUrl + `/prize/editimage`, formData)
			.map((response: Response) => response.json());
	}

}