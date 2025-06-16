import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {AggregatedResponse} from '../models/aggregated-response';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string,
  ) {}

  getDashboardData(): Observable<AggregatedResponse> {
    return this.http.get<AggregatedResponse>(`${this.apiUrl}/api/Data/getAllData`);
  }
}
