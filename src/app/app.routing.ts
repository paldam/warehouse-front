import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guard/auth.guard";
import {MapsComponent} from "./maps/maps.component";
import {ModuleWithProviders} from "@angular/core";

const routes: Routes = [
	{path: '', loadChildren: './products/products.module#ProductsModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: './order/order.module#OrderModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: './customer/customer.module#CustomerModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: './basket/basket.module#BasketModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: './notes/notes.module#NotesModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: './statistic/statistic.module#StatisticModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: './loyalty-program/program.module#ProgramModule', canActivate: [AuthGuard]},
	{path: 'login', component: LoginComponent},
	{path: 'admin', loadChildren: './admin/admin.module#AdminModule', canActivate: [AuthGuard]},
	{path: 'maps', component: MapsComponent, canActivate: [AuthGuard]},
];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});


