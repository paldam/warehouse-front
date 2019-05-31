import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../guard/auth.guard";
import {ModuleWithProviders} from "@angular/core";
import {NotesComponent} from "./notes.component";

const routes: Routes = [
	{path:   'notes', component: NotesComponent,canActivate: [AuthGuard]},
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);