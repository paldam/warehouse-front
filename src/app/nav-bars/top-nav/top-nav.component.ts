import {Component, OnInit, ViewChild} from '@angular/core';
import {LeftNavComponent} from '../left-nav/left-nav.component';
import {User} from "../../model/user.model";
import {NgForm} from "@angular/forms";
import {PasswordChange} from "../../model/password_change.model";
import {TOKEN, TOKEN_USER} from "../../authentication.service";
import {UserService} from "../../user.service";
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class NavComponent implements OnInit {


  constructor() {

  }

  @ViewChild(LeftNavComponent) leftNavComponent : LeftNavComponent;

  ngOnInit() {
  }



  slideChildLeftNavbar(){
    this.leftNavComponent.slidNav();
  }


}

