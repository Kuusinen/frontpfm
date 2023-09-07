import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AdminComponent } from './admin/admin.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  { path: 'categories/:idCategory', component: CategoriesComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'product/:idCategory/:idProduct', component: ProductComponent },
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
