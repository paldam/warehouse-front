import {Component, OnInit, ViewChild} from '@angular/core';
import {GiftBasketComponent} from '../gift-baskets/gift-baskets.component';
import {LeftNavComponent} from '../left-nav/left-nav.component';
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class NavComponent implements OnInit {

  constructor() { }

  @ViewChild(LeftNavComponent) leftNavComponent : LeftNavComponent;

  ngOnInit() {
  }


  slideChildLeftNavbar(){
    this.leftNavComponent.slidNav();
  }


}

