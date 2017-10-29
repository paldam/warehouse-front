import {Component, OnInit, ViewChild} from '@angular/core';
import {LeftNavComponent} from '../left-nav/left-nav.component';
import {User} from "../model/user.model";
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'top-nav',
  templateUrl: 'top-nav.component.html',
  styleUrls: ['top-nav.component.css']
})
export class NavComponent implements OnInit {

  public changePasswordModal : boolean = false;


  constructor() { }

  @ViewChild(LeftNavComponent) leftNavComponent : LeftNavComponent;

  ngOnInit() {
  }


  slideChildLeftNavbar(){
    this.leftNavComponent.slidNav();
  }

  showChangePasswordDialog(user: User) {
    this.changePasswordModal = true;
  }

}

