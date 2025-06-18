import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChartConfiguration} from 'chart.js';
import {DashboardComponent} from '../../dashboard.component';
import {Product} from '../../../../models/product';
import {BaseChartDirective} from 'ng2-charts';
import {Subject, takeUntil} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-crypto-analytics',
  standalone: false,
  templateUrl: './crypto-analytics.component.html'
})
export class CryptoAnalyticsComponent implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  destroy$ = new Subject<void>();

  public barCryptoChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: '',
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1
      }
    ],
  };

  public barCryptoChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  public barCryptoChartLabels: string[] = [];

  constructor(
    private parent: DashboardComponent,
    private translationService: TranslateService
    ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.fillCryptoBoard();

    this.parent.onDataUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fillCryptoBoard()
      })
  }

  private fillCryptoBoard() {
    const labels = this.parent.aggregatedData?.cryptoData.map((item: Product) => item.title ?? '');
    const values =  this.parent.aggregatedData?.cryptoData.map((item: Product) => item.price ?? 0);

    this.barCryptoChartData.labels = labels;
    this.barCryptoChartData.datasets[0].data = values;
    this.barCryptoChartData.datasets[0].label = this.translationService.instant('Prices');

    this.chart?.update();
  }
}
