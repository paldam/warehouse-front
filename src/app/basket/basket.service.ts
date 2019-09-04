import {Http, Response, ResponseContentType} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Basket} from '../model/basket.model';
import {BasketType} from '../model/basket_type.model';
import {HttpService} from "../http-service";
import {OrderItem} from "../model/order_item";
import {OrderStatus} from "../model/OrderStatus";
import {BasketSeason} from "../model/basket_season.model";

@Injectable()
export class BasketService {

    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;

    public constructor(private http : HttpService){
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }

    addBasket(basket: Basket): Observable<Response> {
        return this.http.post(this.baseUrl+`/basket/add`, basket)
            .map((response: Response) => response.json());

    }

    saveBasketWithoutImg(basket: Basket): Observable<Response> {
        return this.http.post(this.baseUrl+`/basketswithoutimage/`, basket)
            .map((response: Response) => response.json());

    }

	addBasketsToStock(orderItems: OrderItem[]): Observable<Response> {
		return this.http.post(this.baseUrl+`/baskets/stockadd`, orderItems)
			.map((response: Response) => response.json());

	}

	saveNewStockOfBasket(basketId: number, newValue : number): Observable<Response> {
		return this.http.get(this.baseUrl+`/baskets/stockadd/${basketId}/${newValue}`)
			.map((response: Response) => response.json());

	}

    saveBasketWithImg(basket: Basket,fileToUpload: File): Observable<Response> {

        const formData: FormData = new FormData();
        formData.append('basketimage', fileToUpload, fileToUpload.name);

        const blobOverrides = new Blob([JSON.stringify(basket)], {
            type: 'application/json',
        });
        formData.append('basketobject', blobOverrides);



        return this.http.post(this.baseUrl+`/baskets/`, formData)
            .map((response: Response) => response.json());

    }

	getBasketWithFilter(priceMin: number,priceMax: number, productsSubTypes: number[]) {
		return this.http.get(this.baseUrl + `/basket/find/${priceMin}/${priceMax}/${productsSubTypes}`)
			.map((response: Response) => response.json());
	}

	getBasketSeason() :Observable<BasketSeason[]>{
		return this.http.get(this.baseUrl+`/baskets_seasons`)
			.map((response: Response) =>
				response.json());
	}

	getBasketsPage(page : number, size : number, text: string, sortField:string , sortingDirection: number, onlyArchival:boolean ,basketSeasonFilter : any[]): Observable<any[]>{
		return this.http.get(this.baseUrl+`/basketpage?page=${page}&size=${size}&searchtext=${text}&orderBy=${sortField}&sortingDirection=${sortingDirection}&onlyArchival=${onlyArchival}&basketSeasonFilter=${basketSeasonFilter}`)
			.map((response: Response) =>
				response.json());
	}


    getBasketImg(basketId: number): any {
        return this.http.get(this.baseUrl + `/basketimage/${basketId}`,{ responseType: ResponseContentType.Blob })
            .map(res => {
                return new Blob([res.blob()], { type: 'image/jpeg' })
            })

    }

    getBasketPdf(id: number): any {
        return this.http.get(this.baseUrl + `/basket/pdf/${id}`,{ responseType: ResponseContentType.Blob })
            .map(res => {
                return new Blob([res.blob()], { type: 'application/pdf' })
            })

    }

    getBaskets(): Observable<Basket[]> {
        return this.http.get(this.baseUrl+`/baskets/`)
            .map((response: Response) => response.json());
    }

	getBasketsDto(): Observable<Basket[]> {
		return this.http.get(this.baseUrl+`/basketsdto/`)
			.map((response: Response) => response.json());
	}

    getBasketsWithDeleted(): Observable<Basket[]> {
        return this.http.get(this.baseUrl+`/basketswithdeleted/`)
            .map((response: Response) => response.json());
    }



    getDeletedBaskets(): Observable<Basket[]> {
        return this.http.get(this.baseUrl+`/deletedbaskets/`)
            .map((response: Response) => response.json());
    }

    getBasket(id: number): Observable<Basket> {
        return this.http.get(this.baseUrl+`/basket/${id}`)
            .map((response: Response) => response.json());
    }

    getNumberOfBasketOrdered(startDate , endDate): Observable<any[]> {
        return this.http.get(this.baseUrl+`/baskets/statistic/daterange?startDate=${startDate}&endDate=${endDate}`)
            .map((response: Response) =>
                response.json());
    }



    getNumberOfBasketOrderedFilteredByOrderDate(startDate , endDate): Observable<any[]> {
        return this.http.get(this.baseUrl+`/baskets/statistic/orderdaterange?startDate=${startDate}&endDate=${endDate}`)
            .map((response: Response) =>
                response.json());
    }

    getBasketsTypes(): Observable<BasketType[]> {
        return this.http.get(this.baseUrl+`/baskets/types`)
            .map((response: Response) => response.json());
    }
}


