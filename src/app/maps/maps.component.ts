import { Component, OnInit } from '@angular/core';
import {MapService} from "./map.service";
import {Order} from "../model/order.model";
import {NgForm} from "@angular/forms";
import {MapModel} from "../model/map.model";


declare var google: any;
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  public mapa: any;
  public orders: Order[]=[];
  public mapModel: MapModel[]=[];
  value: Date;
  dateLang: any;
  public formSubmitted: boolean = false;
  public startDate: Date;
  public endDate: Date;

  constructor(private mapService :MapService) {
    mapService.getOrdersByDateRange('2012-11-11','2022-11-11').subscribe((data : Order[])=>{
      this.orders = data;


    })
  }

  ngOnInit() {
    this.startMaps();
    this.dateLang = {
      firstDayOfWeek: 0,
      dayNames: ["Sobota", "Poniedziałek", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
      dayNamesMin: ["Nd","Po","Wt","Śr","Cz","Pi","So"],
      monthNames: [ "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień" ],
      monthNamesShort: [ "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze","Lip", "Sie", "Wrz", "Paź", "Lis", "Gru" ],
      today: 'Dzisiaj',
      clear: 'czyść'
    };
  }


  startMaps(): void {
    let wspolrzedne = new google.maps.LatLng(52.2296756, 21.0122287);
    let opcjeMapy = {
      zoom: 7,
      center: wspolrzedne,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      disableDefaultUI: true,
      scaleControl: true,
      rotateControl: true,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,

    };
    this.mapa = new google.maps.Map(document.getElementById("mapka"), opcjeMapy);


    for (let x = 0; x < this.mapModel.length; x++) {

      this.mapService.getGeolocation(this.mapModel[x].address).subscribe((data: any) => {
        console.log(data.status);
        if (data.status == 'OK' ){
          let p = data.results[0].geometry.location;
          let latlng = new google.maps.LatLng(p.lat, p.lng);
          new google.maps.Marker({
            position: latlng,
            map: this.mapa,
            label: '' + (x + 1)
          });
        }else{
          console.log("Nie znaleziono wyników");
        }

      }, err => {
        console.log(err);
      })
    }
  }

  submitOrderForm(form: NgForm) {
    this.formSubmitted = true;
    this.mapModel =[];
    this.mapService.getOrdersByDateRange(this.startDate.toISOString().substring(0, 10),this.endDate.toISOString().substring(0, 10)).subscribe(data =>{
      console.log(data);
        this.orders = data;

        this.orders.map((data,index)=> {
          let address : string= data.address.address+' '+data.address.cityName+ ' '+data.address.zipCode;
          this.mapModel.push(new MapModel(address,data.orderFvNumber,index+1,data.deliveryDate));
        })

      this.startMaps();
    })

    this.startMaps();



    }


}





