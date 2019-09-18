import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "../guard/auth.guard";

import {ModuleWithProviders} from "@angular/core";
import {ProgramUserComponent} from "./program-user/program-user.component";
import {PrizeOrderComponent} from "./prize-order/prize-order.component";
import {PrizeComponent} from "./prize/prize.component";
import {PointsSchemeComponent} from "./points-scheme/points-scheme.component";

const routes: Routes = [
	{path: 'program/user', component: ProgramUserComponent, canActivate: [AuthGuard]},
	{path: 'program/orders', component: PrizeOrderComponent, canActivate: [AuthGuard]},
	{path: 'program/prize', component: PrizeComponent, canActivate: [AuthGuard]},
	{path: 'program/scheme', component: PointsSchemeComponent, canActivate: [AuthGuard]}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
