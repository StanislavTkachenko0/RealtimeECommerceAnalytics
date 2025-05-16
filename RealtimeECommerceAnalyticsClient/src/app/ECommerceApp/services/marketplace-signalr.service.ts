import {Inject, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceSignalRService {
  private hubConnection!: signalR.HubConnection;

  private productStatsSource = new BehaviorSubject<any[]>([]);
  public productStats$ = this.productStatsSource.asObservable();

  constructor(@Inject('API_URL') private apiUrl: string) {
    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + 'Hubs/marketplaceHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected');
        this.registerListeners();
      })
      .catch(err => console.error('Error while starting SignalR connection: ' + err));
  }

  private registerListeners(): void {
    this.hubConnection.on('ReceiveProductStats', (data: any[]) => {
      this.productStatsSource.next(data);
    });
  }
}
