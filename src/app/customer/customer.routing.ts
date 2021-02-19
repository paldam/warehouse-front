import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../guard/auth.guard";
import {ModuleWithProviders} from "@angular/core";
import {CustomerComponent} from "./customer-view/customer.component";
import {CustomerEditComponent} from "./customer-edit/customer-edit.component";
const routes: Routes = [
	{path: 'customer/list', component: CustomerComponent, canActivate: [AuthGuard]},
	{path: 'customer/detail/:id', component: CustomerEditComponent, canActivate: [AuthGuard]}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);

