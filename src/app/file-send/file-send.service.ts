/**
 * Created by Damian on 14.08.2018.
 */
import {Injectable} from '@angular/core';
import {Http, Response, ResponseContentType} from "@angular/http";
import {HttpService} from "../http-service";
import {Observable} from "rxjs/Rx";
import {Basket} from "../model/basket.model";

@Injectable()
export class FileSendService {


    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;
    public fileName: string;
    public fileType: string;

    public constructor(private http: HttpService) {
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }



    getFile(id: number): any{
        return this.http.get(this.baseUrl + `/file/${id}`,{responseType: ResponseContentType.Blob})
            .map(res => {

                this.fileName = res.headers.get('content-disposition').split(';')[1].trim().split('=')[1];
                this.fileType = res.headers.get('content-disposition').split(';')[1].trim().split('=')[1];

                return new Blob([res.blob()], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            })

    }

    deleteFile(id: number): Observable<Response>{
        return this.http.delete(this.baseUrl + `/file/delete/${id}`)
            .map((response: Response) => response.json());

    }



}