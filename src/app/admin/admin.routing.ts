import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "./admin.component";
import {AuthGuard} from "../guard/auth.guard";
import {AdminGuard} from "../guard/admin.guard";
const routes: Routes = [
	{path: '', component: AdminComponent, canActivate: [AuthGuard, AdminGuard]}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);