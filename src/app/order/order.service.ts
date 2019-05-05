
import {Injectable} from '@angular/core';
import {Http, Response, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Order} from '../model/order.model';
import {DeliveryType} from '../model/delivery_type.model';
import {OrderStatus} from "../model/OrderStatus";
import {HttpService} from "../http-service";
import {TOKEN_USER} from "../authentication.service";
import {File} from "../model/file";
import {OrderItem} from "../model/order_item";
@Injectable()
export class OrderService {

    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;

    public constructor(private http: HttpService) {
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }


    saveOrder(order: Order): Observable<Order> {
        return this.http.post(this.baseUrl + `/orders/`, order)
        .map((response: Response) => response.json());
    }
    getDeliveryTypes() :Observable<DeliveryType[]>{
        return this.http.get(this.baseUrl+`/delivery/types`)
            .map((response: Response) =>
                response.json());
    }

    getOrderStatus() :Observable<OrderStatus[]>{
        return this.http.get(this.baseUrl+`/order_status`)
            .map((response: Response) =>
                response.json());
    }

    getOrder(id: number): Observable<Order>{
        return this.http.get(this.baseUrl+`/order/${id}`)
            .map((response: Response) =>
                response.json());
    }
    getOrderStateFromHistoryByRevId(id: number): Observable<Order>{
        return this.http.get(this.baseUrl+`/orderhistory/${id}`)
            .map((response: Response) =>
                response.json());
    }
    getOrderPrevStateFromHistoryByRevId(id: number): Observable<Order>{
        return this.http.get(this.baseUrl+`/order_history_prev_rev/${id}`)
            .map((response: Response) =>
                response.json());
    }




    getOrdersByBasketIdAndOrderDateRange(basketId,startDate,endDate): Observable<any[]> {
        return this.http.get(this.baseUrl+`/order/statistic/orderdaterange?basketId=${basketId}&startDate=${startDate}&endDate=${endDate}`)
            .map((response: Response) =>
                response.json());
    }


    getOrderItems(id: number): Observable<OrderItem>{
        return this.http.get(this.baseUrl+`/order/${id}`)
            .map((response: Response) =>
                response.json());
    }


    getOrderAudit(id: number): Observable<any>{
        return this.http.get(this.baseUrl+`/order/audit/${id}`)
            .map((response: Response) =>
                response.json());
    }

    getOrderByCustomer(id: number): Observable<Order[]>{
    return this.http.get(this.baseUrl+`/order/customer/${id}`)
        .map((response: Response) =>
            response.json());
    }

    getOrders(): Observable<Order[]>{
    return this.http.get(this.baseUrl+`/orders/`)
        .map((response: Response) =>
            response.json());
}

    getOrdersDto( page : number, size : number, text: string, sortField:string , sortingDirection: number,orderStatusFilterList : any[],orderDataFilterList : any[] ): Observable<any[]>{
        return this.http.get(this.baseUrl+`/orderdao?page=${page}&size=${size}&searchtext=${text}&orderBy=${sortField}&sortingDirection=${sortingDirection}&orderStatusFilterList=${orderStatusFilterList}&orderYearsFilterList=${orderDataFilterList}`)
            .map((response: Response) =>
                response.json());
    }


    getOrdersDtoTotalRows( page : number, size : number, text: string): Observable<any[]>{
        return this.http.get(this.baseUrl+`/orderdaocount?page=${page}&size=${size}&searchtext=${text}`)
            .map((response: Response) =>
                response.json());
    }

    getOrderTotalRows(): Observable<number>{
        return this.http.get(this.baseUrl+`/ordercount`)
            .map((response: Response) =>
                response.json());
    }

    getOrdersYears(): Observable<number>{
        return this.http.get(this.baseUrl+`/ordersyears`)
            .map((response: Response) =>
                response.json());
    }


    getOrderStats(): Observable<any[]>{
        return this.http.get(this.baseUrl+`/orderstats/`)
            .map((response: Response) =>
                response.json());
    }

    getOrdersWithAttach(): Observable<Order[]>{
        return this.http.get(this.baseUrl+`/orderswithattch/`)
            .map((response: Response) =>
                response.json());
    }

    getPdf(id: number): any {
    return this.http.get(this.baseUrl + `/order/pdf/${id}`,{ responseType: ResponseContentType.Blob })
        .map(res => {
            return new Blob([res.blob()], { type: 'application/pdf' })
        })

}

    getProductListPdf(id: number): any {
        return this.http.get(this.baseUrl + `/order/pdf/product_to_collect/${id}`,{ responseType: ResponseContentType.Blob })
            .map(res => {
                return new Blob([res.blob()], { type: 'application/pdf' })
            })

    }




    getOrderBasketsProductsPdf(orderItems : any): any {
        return this.http.post(this.baseUrl + `/order/pdf/aaa`,orderItems,{ responseType: ResponseContentType.Blob })
            .map(res => {
                return new Blob([res.blob()], { type: 'application/pdf' })
            })

    }



    getMultiplePdf(ids: number[]): any {
        return this.http.post( this.baseUrl + `/order/multipdf`,null,{
                params: {
                    ordersIdList: ids
                },

                responseType: ResponseContentType.Blob
                })

            .map(res => {
                    return new Blob([res.blob()], { type: 'application/pdf' })
                })

    }


    getMultipleConfirmationPdf(ids: number[]): any {
        return this.http.post( this.baseUrl + `/order/multideliverypdf/`,null,{
            params: {
                ordersIdList: ids
            },

            responseType: ResponseContentType.Blob
        })

            .map(res => {
                return new Blob([res.blob()], { type: 'application/pdf' })
            })

    }




    getConfirmationPdf(id: number, orderItems?: OrderItem[]): any {

        if(orderItems){
            return this.http.post(this.baseUrl + `/order/deliverypdfwithmodyfication/${id}`,orderItems,{ responseType: ResponseContentType.Blob })
                .map(res => {
                    return new Blob([res.blob()], { type: 'application/pdf' })
                })

        }else {

            return this.http.get(this.baseUrl + `/order/deliverypdf/${id}`,{ responseType: ResponseContentType.Blob })
                .map(res => {
                    return new Blob([res.blob()], { type: 'application/pdf' })
                })
        }



    }

    getFileList(orderId :number) :Observable<File[]>{
        return this.http.get(this.baseUrl+`/orderfile/${orderId}`)
            .map((response: Response) =>
                response.json());
    }

    deleteOrder(id : number): Observable<Response> {
        return this.http.delete(this.baseUrl+`/order/${id}`)

    }

    changeOrderStatus(orderId: number, statusId: number): Observable<Response>{
        return this.http.post(this.baseUrl+`/order/status/${orderId}/${statusId}`,null)

    }



}