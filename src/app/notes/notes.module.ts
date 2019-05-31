import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PrimeNgModule} from "../prime-ng.module";
import {routing} from "./notes.routing";
import {NotesComponent} from "./notes.component";
import {NotesService} from "./notes-service";

@NgModule({
	declarations: [NotesComponent],
	imports: [routing,CommonModule,PrimeNgModule],
	providers: [NotesService],

})
export class NotesModule {
}
