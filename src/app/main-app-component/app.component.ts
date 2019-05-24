import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {RoutingState} from "../routing-stage";
import {SpinerService} from "../spiner.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'app';




    constructor(routingState: RoutingState, public spinerService :SpinerService) {
        routingState.loadRouting();
    }



}
