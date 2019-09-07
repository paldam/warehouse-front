import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../guard/auth.guard";

import {ModuleWithProviders} from "@angular/core";
import {ProgramUserComponent} from "./program-user/program-user.component";

const routes: Routes = [
	{path: 'program/user', component: ProgramUserComponent, canActivate: [AuthGuard]}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
