import {NgModule} from "@angular/core";
import {ProgramUserComponent} from "./program-user/program-user.component";
import {CommonModule} from "@angular/common";
import {PrimeNgModule} from "../prime-ng.module";
import {routing} from "./program.routing";
import {UserService} from "../user.service";
import { PrizeOrderComponent } from './prize-order/prize-order.component';
import {PrizeService} from "./prize.service";
import { PrizeComponent } from './prize/prize.component';
import { PointsSchemeComponent } from './points-scheme/points-scheme.component';
import {BasketService} from "../basket/basket.service";
import {ConfirmationService} from "primeng/api";


@NgModule({
	declarations: [ProgramUserComponent, PrizeOrderComponent, PrizeComponent, PointsSchemeComponent],
	imports: [routing ,CommonModule,PrimeNgModule],
	providers: [UserService,PrizeService,BasketService,ConfirmationService]
})
export class ProgramModule {
}