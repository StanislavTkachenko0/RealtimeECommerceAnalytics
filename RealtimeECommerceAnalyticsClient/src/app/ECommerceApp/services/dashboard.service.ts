import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string,
  ) {}

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Data/getAllData`);
  }
}
