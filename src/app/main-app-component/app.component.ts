import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {RoutingState} from "../routing-stage";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';


    constructor(routingState: RoutingState) {
        routingState.loadRouting();
    }
}
