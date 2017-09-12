import { Routes, RouterModule } from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {TestComponent} from './test/test.component';
import {ProductFormComponent} from './products/products-form/product-form.component';
const routes: Routes = [
    { path: 'product', component: ProductsComponent },
    { path: 'product/add', component: ProductFormComponent },
    { path: 'product/addd', component: TestComponent }];
export const routing = RouterModule.forRoot(routes);
