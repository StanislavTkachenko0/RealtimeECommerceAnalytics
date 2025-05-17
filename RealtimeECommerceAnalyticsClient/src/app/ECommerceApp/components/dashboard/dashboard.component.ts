import {Component, OnInit} from '@angular/core';
import {MarketplaceSignalRService} from '../../services/marketplace-signalr.service';
import {ChartConfiguration} from 'chart.js';
import {CryptoSignalrService} from '../../services/crypto-signalr.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false
})
export class DashboardComponent implements OnInit {
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

  constructor(
    private signalRService: MarketplaceSignalRService,
    private cryptoSignalRService: CryptoSignalrService
  ) {}

  ngOnInit(): void {
    this.setProductsStat();
    this.setCryptoStats();
  }

  private setProductsStat() {
    this.signalRService.productStats$.subscribe(data => {
      const labels = data.map((item: any) => item.category);
      const values = data.map((item: any) => item.averagePrice);

      this.barChartData.labels = labels;
      this.barChartData.datasets[0].data = values;
      console.log('Отримані оновлені данні:', data);
    });
  }

  private setCryptoStats() {
    this.cryptoSignalRService.cryptoPrices$.subscribe(data => {
      console.log('Отримані оновлені данні:', data);
    });
  }
}
