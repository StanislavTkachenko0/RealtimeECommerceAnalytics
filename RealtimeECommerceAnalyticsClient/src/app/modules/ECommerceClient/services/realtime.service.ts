import {Inject, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import {environment} from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private hubConnection!: signalR.HubConnection;
  private dataUpdatedSubject = new BehaviorSubject<void>(undefined);
  dataUpdated$ = this.dataUpdatedSubject.asObservable();

  constructor(
    @Inject('API_URL') private apiUrl: string,
  ) {
    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + '/hubs/analyticsHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.log('Error while starting SignalR: ' + err));

    this.hubConnection.on('dataUpdated', () => {
      console.log('Data updated received');
      this.dataUpdatedSubject.next();
    });
  }
}
