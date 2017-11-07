import { Injectable} from '@angular/core';

declare var $ :any;


@Injectable()
export class CalendarSetingsComponent  {

    value: Date;
    dateLang: any  = {
        firstDayOfWeek: 0,
        dayNames: ["Sobota", "Poniedziałek", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
        dayNamesMin: ["Nd","Po","Wt","Śr","Cz","Pi","So"],
        monthNames: [ "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień" ],
        monthNamesShort: [ "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze","Lip", "Sie", "Wrz", "Paź", "Lis", "Gru" ],
        today: 'Dzisiaj',
        clear: 'czyść'}

    constructor() {
    }



}