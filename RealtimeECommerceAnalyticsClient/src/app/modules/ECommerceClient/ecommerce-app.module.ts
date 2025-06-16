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
import {AuthInterceptor} from '../../interceptors/auth.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './guards/auth.guard';
import {AuthService} from '../../services/auth.service';
import { CryptoAnalyticsComponent } from './components/dashboard/components/crypto-analytics/crypto-analytics.component';
import { ClientBusyComponent } from './components/client-busy/client-busy.component';
import { FakeStoreComponent } from './components/dashboard/components/fake-store/fake-store.component';
import {TabMenuModule} from "primeng/tabmenu";
import { DummyComponent } from './components/dashboard/components/dummy/dummy.component';
import { OpenFoodComponent } from './components/dashboard/components/open-food/open-food.component';
import { OpenLibraryComponent } from './components/dashboard/components/open-library/open-library.component';
import {NavBarModule} from "../nav-bar/nav-bar.module";
import {ProfileComponent} from '../../components/profile/profile.component';

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
    SignInUpComponent,
    CryptoAnalyticsComponent,
    ClientBusyComponent,
    FakeStoreComponent,
    DummyComponent,
    OpenFoodComponent,
    OpenLibraryComponent
  ],
    imports: [
        RouterModule.forChild([
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
                            component: DashboardComponent,
                            children: [
                                {
                                    path: '',
                                    redirectTo: 'crypto',
                                    pathMatch: 'full'
                                },
                                {
                                    path: 'crypto',
                                    component: CryptoAnalyticsComponent
                                },
                                {
                                    path: 'fake-store',
                                    component: FakeStoreComponent
                                },
                                {
                                    path: 'dummy',
                                    component: DummyComponent
                                },
                                {
                                    path: 'open-food',
                                    component: OpenFoodComponent
                                },
                                {
                                    path: 'open-library',
                                    component: OpenLibraryComponent
                                }
                            ]
                        },
                        {
                          path: 'profile',
                          component: ProfileComponent,
                        }
                    ]
                },
                {path: '**', redirectTo: 'sign-in'}
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
        TabMenuModule,
        NavBarModule,
    ],
  providers: [
    AuthGuard
  ],
  bootstrap: []
})
export class EcommerceAppModule { }
