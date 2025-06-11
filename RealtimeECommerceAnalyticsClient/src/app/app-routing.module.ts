import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'client',
    pathMatch: 'full',
  },
  {
    path: 'client',
    loadChildren: () => import('./ECommerceApp/ecommerce-app.module').then(module => module.EcommerceAppModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./ECommerceAdmin/ecommerce-admin.module').then(module => module.EcommerceAdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
