import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChartConfiguration} from 'chart.js';
import {RealtimeService} from '../../services/realtime.service';
import {DashboardService} from '../../services/dashboard.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {

  destroy$: Subject<void> = new Subject<void>();

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

  public barCryptoChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Crypto Prices',
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
    private realtimeService: RealtimeService,
    private dashboardService: DashboardService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.loadDashboardData();

    this.realtimeService.dataUpdated$.subscribe(() => {
      this.loadDashboardData(); // метод, який оновлює графіки
    });
  }


  private loadDashboardData() {
    this.dashboardService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        console.log(res)
      })
  }
}
