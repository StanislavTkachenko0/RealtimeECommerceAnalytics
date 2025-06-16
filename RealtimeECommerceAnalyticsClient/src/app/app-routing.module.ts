import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignInUpComponent} from './modules/ECommerceClient/pages/sign-in-up/sign-in-up.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'client',
    pathMatch: 'full',
  },
  {
    path: 'client',
    loadChildren: () => import('./modules/ECommerceClient/ecommerce-app.module').then(module => module.EcommerceAppModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/ECommerceAdmin/ecommerce-admin.module').then(module => module.EcommerceAdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
