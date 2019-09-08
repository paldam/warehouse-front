import {NgModule} from "@angular/core";
import {ProgramUserComponent} from "./program-user/program-user.component";
import {CommonModule} from "@angular/common";
import {PrimeNgModule} from "../prime-ng.module";
import {routing} from "./program.routing";
import {UserService} from "../user.service";
import { PrizeOrderComponent } from './prize-order/prize-order.component';
import {PrizeService} from "./prize.service";


@NgModule({
	declarations: [ProgramUserComponent, PrizeOrderComponent],
	imports: [routing ,CommonModule,PrimeNgModule],
	providers: [UserService,PrizeService]
})
export class ProgramModule {
}