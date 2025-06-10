import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardComponent} from '../../dashboard.component';
import {Product} from '../../../../models/product';
import {ChartConfiguration} from 'chart.js';
import {Subject, takeUntil} from 'rxjs';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-fake-store',
  standalone: false,
  templateUrl: './fake-store.component.html'
})
export class FakeStoreComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  destroy$ = new Subject<void>();

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Average Price',
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

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  public barChartLabels: string[] = [];

  constructor(private parent: DashboardComponent) {
  }

  ngOnInit() {
    this.fillFakeStoreBoard();

    this.parent.onDataUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fillFakeStoreBoard()
      })
  }

  private fillFakeStoreBoard() {
    const labels = this.parent.aggregatedData?.fakeStoreData.map((item: Product) => {
      const title = item?.title ?? '';
      return title.length > 15 ? title.slice(0, 12) + '...' : title;
    });
    const values =  this.parent.aggregatedData.fakeStoreData.map((item: Product) => item.price ?? 0);

    this.barChartData.labels = labels;
    this.barChartData.datasets[0].data = values;
  }
}
