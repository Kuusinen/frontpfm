import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AdminComponent } from './admin/admin.component';
import { ProductComponent } from './product/product.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'categories/:idCategory', component: CategoriesComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: '', component: HomepageComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'contact/:pathProduct/:nameProduct', component: ContactComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'product/:idCategory/:idProduct', component: ProductComponent },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
