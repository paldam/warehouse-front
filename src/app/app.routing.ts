import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guard/auth.guard";
import {MapsComponent} from "./maps/maps.component";
import {ModuleWithProviders} from "@angular/core";
import {FileSendComponent} from "./file-send/file-send.component";

const routes: Routes = [
	{path: '', loadChildren: 'app/products/products.module#ProductsModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: 'app/order/order.module#OrderModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: 'app/customer/customer.module#CustomerModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: 'app/basket/basket.module#BasketModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: 'app/notes/notes.module#NotesModule', canActivate: [AuthGuard]},
	{path: '', loadChildren: 'app/statistic/statistic.module#StatisticModule', canActivate: [AuthGuard]},
	{path: 'login', component: LoginComponent},
	{path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule', canActivate: [AuthGuard]},
	{path: 'maps', component: MapsComponent, canActivate: [AuthGuard]},
	{path: 'file', component: FileSendComponent},
];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});


