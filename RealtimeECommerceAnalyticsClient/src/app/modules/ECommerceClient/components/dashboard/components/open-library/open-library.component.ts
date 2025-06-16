import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {Subject, takeUntil} from 'rxjs';
import {ChartConfiguration} from 'chart.js';
import {DashboardComponent} from '../../dashboard.component';
import {Product} from '../../../../models/product';

@Component({
  selector: 'app-open-library',
  standalone: false,
  templateUrl: './open-library.component.html',
})
export class OpenLibraryComponent implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  destroy$ = new Subject<void>();

  public barLibraryChartData: ChartConfiguration<'bar'>['data'] = {
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

  public barLibraryChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  public barLibraryChartLabels: string[] = [];

  constructor(private parent: DashboardComponent) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.fillLibraryBoard();

    this.parent.onDataUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fillLibraryBoard()
      })
  }

  private fillLibraryBoard() {
    const labels = this.parent.aggregatedData?.openLibraryData.map((item: Product) => {
      const title = item?.title ?? '';
      return title.length > 15 ? title.slice(0, 12) + '...' : title;
    });

    const values = this.parent.aggregatedData?.openLibraryData.map((item: Product) => item?.price ?? 0);

    this.barLibraryChartData.labels = labels;
    this.barLibraryChartData.datasets[0].data = values;

    this.chart?.update();
  }
}
