import {Http,Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Basket} from '../model/basket.model';
import {BasketType} from '../model/basket_type.model';
import {HttpService} from "../http-service";
import {Notes} from "../model/notes.model";

@Injectable()
export class NotesService {

    public protocol: string = "http";
    public port: number = 8080;
    public baseUrl: string;

    public constructor(private http : HttpService){
        this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
    }




    getNotes(): Observable<Notes[]> {
        return this.http.get(this.baseUrl+`/notes`)
            .map((response: Response) => response.json());
    }


    getNote(id: number): Observable<Notes> {
        return this.http.get(this.baseUrl+`/notes/${id}`)
            .map((response: Response) => response.json());
    }

    saveOrUpdateNote(note: Notes): Observable<Response> {
        return this.http.post(this.baseUrl+`/notes/`, note)
            .map((response: Response) => response.json());

    }
}


