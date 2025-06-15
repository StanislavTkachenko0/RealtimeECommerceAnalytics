import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string,
  ) {
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/user/getUsers`);
  }

  public archiveUser(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/api/user/archiveUser?id=${id}`);
  }
}
