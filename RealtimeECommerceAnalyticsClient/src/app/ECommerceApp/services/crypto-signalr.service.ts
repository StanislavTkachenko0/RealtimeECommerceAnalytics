import {Inject, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoSignalrService {
  private hubConnection!: signalR.HubConnection;

  private cryptoPricesSource = new BehaviorSubject<any[]>([]);
  public cryptoPrices$ = this.cryptoPricesSource.asObservable();

  constructor(@Inject('API_URL') private apiUrl: string) {
    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + 'Hubs/cryptoHub')
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
    this.hubConnection.on('ReceiveCryptoPrices', (data: any[]) => {
      this.cryptoPricesSource.next(data);
    });
  }
}
