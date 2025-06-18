import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {Subject, takeUntil} from 'rxjs';
import {ChartConfiguration} from 'chart.js';
import {DashboardComponent} from '../../dashboard.component';
import {Product} from '../../../../models/product';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-open-food',
  standalone: false,
  templateUrl: './open-food.component.html',
})
export class OpenFoodComponent implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  destroy$ = new Subject<void>();

  public barFoodChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Dummy Items',
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

  public barFoodChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  public barFoodChartLabels: string[] = [];

  constructor(
    private parent: DashboardComponent,
    private translationService: TranslateService,
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.fillFoodBoard();

    this.parent.onDataUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fillFoodBoard()
      })
  }

  private fillFoodBoard() {
    const labels = this.parent.aggregatedData?.openFoodFactsData.map((item: Product) => {
      const title = item?.title ?? '';
      return title.length > 15 ? title.slice(0, 12) + '...' : title;
    });
    const values =  this.parent.aggregatedData?.openFoodFactsData.map((item: Product) => item?.price ?? 0);

    this.barFoodChartData.labels = labels;
    this.barFoodChartData.datasets[0].data = values;
    this.barFoodChartData.datasets[0].label = this.translationService.instant('Prices');

    this.chart?.update();
  }
}
