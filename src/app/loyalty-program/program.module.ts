import {NgModule} from "@angular/core";
import {ProgramUserComponent} from "./program-user/program-user.component";
import {CommonModule} from "@angular/common";
import {PrimeNgModule} from "../prime-ng.module";
import {routing} from "./program.routing";
import {UserService} from "../user.service";
import { PrizeOrderComponent } from './prize-order/prize-order.component';
import {PrizeService} from "./prize.service";
import { PrizeComponent } from './prize/prize.component';


@NgModule({
	declarations: [ProgramUserComponent, PrizeOrderComponent, PrizeComponent],
	imports: [routing ,CommonModule,PrimeNgModule],
	providers: [UserService,PrizeService]
})
export class ProgramModule {
}