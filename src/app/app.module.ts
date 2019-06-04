import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './main-app-component/app.component';
import {HttpModule, RequestOptions, XHRBackend} from '@angular/http';
import {NavComponent} from './nav-bars/top-nav/top-nav.component';
import {LeftNavComponent} from './nav-bars/left-nav/left-nav.component';
import {ConfirmationService,} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routing} from './app.routing';
//import {ProductFormComponent} from './products/products-add-form/product-form.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "./guard/auth.guard";
import {AuthenticationService} from "./authentication.service";
import {HttpService} from "./http-service";
import {Router} from "@angular/router";
import {AdminGuard} from "./guard/admin.guard";
import {UserService} from "./user.service";
import {AdminOrSuperUserGuard} from "./guard/adminOrSuperUser.guard";
import {MapService} from "./maps/map.service";
import {CalendarSetingsComponent} from "./primeNgCalendarSetings/calendarStings.component";
import {FileSendService} from "./file-send/file-send.service";
import {MessageService} from "primeng/api";
import {MessageServiceExt} from './messages/messageServiceExt';
import {RoutingState} from "./routing-stage";
import {SpinerService} from "./spiner.service";
import {PrimeNgModule} from "./prime-ng.module";
import {MapsComponent} from "./maps/maps.component";
import {FileSendComponent} from "./file-send/file-send.component";

export function httpExt(backend: XHRBackend, options: RequestOptions, router: Router, messageService: MessageService,messageServiceExt: MessageServiceExt) {
	return new HttpService(backend, options, router, messageService,messageServiceExt );
}

@NgModule({
	declarations: [ //all loaded on start apps
		AppComponent,
		NavComponent,
		LeftNavComponent,
		LoginComponent,
		FileSendComponent,
		MapsComponent
	],
	imports: [
		routing, BrowserModule, HttpModule, BrowserAnimationsModule, PrimeNgModule
	],
	providers: [{
		provide: HttpService, useFactory: (httpExt), deps: [XHRBackend, RequestOptions, Router, MessageService, MessageServiceExt]
	},
		CalendarSetingsComponent, MessageServiceExt, RoutingState, SpinerService, MessageService, FileSendService, MapService,
		ConfirmationService, AuthGuard, AdminGuard, AdminOrSuperUserGuard, AuthenticationService, UserService],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {
}
