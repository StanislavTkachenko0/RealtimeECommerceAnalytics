import { NgModule } from '@angular/core';

import { MainPageComponent } from './pages/main-page/main-page.component';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {NgForOf} from '@angular/common';
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
    MainPageComponent
  ],
  imports: [

    RouterModule.forChild([
        {
          path: '', component: MainPageComponent,
          children: [
            {
              path: '', redirectTo: 'dashboard', pathMatch: 'full'
            },
            {
              path: 'dashboard',
              component: DashboardComponent
            },
          ]
        }
      ]
    ),
    NgForOf,
    BaseChartDirective
  ],
  providers: [
  ],
  bootstrap: []
})
export class EcommerceAppModule { }
