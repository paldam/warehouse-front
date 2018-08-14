/**
 * Created by Damian on 14.08.2018.
 */
import {Injectable} from '@angular/core';
import {Http, ResponseContentType} from "@angular/http";
import {HttpService} from "../http-service";

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

    // dowload2(){
    //
    //     this.download().subscribe(res=>{
    //         let a = document.createElement("a")
    //         let blobURL = URL.createObjectURL(res)
    //         a.download = this.fileName;
    //         a.href = blobURL
    //         document.body.appendChild(a)
    //         a.click()
    //         document.body.removeChild(a)
    //     });
    // }

}