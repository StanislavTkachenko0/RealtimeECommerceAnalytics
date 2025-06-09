import { NgModule } from '@angular/core';

import { MainPageComponent } from './pages/main-page/main-page.component';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {NgForOf, NgIf} from '@angular/common';
import {BaseChartDirective} from 'ng2-charts';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { SignInUpComponent } from './pages/sign-in-up/sign-in-up.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {ButtonDirective} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {FloatLabelModule} from 'primeng/floatlabel';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './guards/auth.guard';
import {AuthService} from './services/auth.service';

Chart.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);


@NgModule({
  declarations: [
    DashboardComponent,
    MainPageComponent,
    SignInUpComponent
  ],
  imports: [
    RouterModule.forChild([
        {
          path: 'sign-in',
          component: SignInUpComponent
        },
        {
          path: 'sign-up',
          component: SignInUpComponent
        },
        {
          path: '',
          component: MainPageComponent,
          canActivate: [AuthGuard],
          children: [
            {
              path: '', redirectTo: 'dashboard', pathMatch: 'full'
            },
            {
              path: 'dashboard',
              component: DashboardComponent
            },
          ]
        },
        { path: '**', redirectTo: 'sign-in' }
      ]
    ),
    NgForOf,
    BaseChartDirective,
    ReactiveFormsModule,
    NgIf,
    PasswordModule,
    ButtonDirective,
    InputTextModule,
    CardModule,
    FloatLabelModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    AuthGuard
  ],
  bootstrap: []
})
export class EcommerceAppModule { }
