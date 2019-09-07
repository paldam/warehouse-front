import {NgModule} from "@angular/core";
import {ProgramUserComponent} from "./program-user/program-user.component";
import {CommonModule} from "@angular/common";
import {PrimeNgModule} from "../prime-ng.module";
import {routing} from "./program.routing";
import {UserService} from "../user.service";


@NgModule({
	declarations: [ProgramUserComponent],
	imports: [routing ,CommonModule,PrimeNgModule],
	providers: [UserService]
})
export class ProgramModule {
}