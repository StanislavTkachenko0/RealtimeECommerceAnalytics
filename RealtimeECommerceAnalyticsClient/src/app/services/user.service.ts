import {Inject, Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {ChangePassword} from '../models/change-password';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user = new ReplaySubject<User>();

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

  public getUser(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/user/getUser?email=${email}`);
  }

  updateProfileField(field: 'firstName' | 'lastName', value: string): Observable<any> {
    const body = { [field]: value };
    return this.http.patch(`${this.apiUrl}/api/user/updateField`, body);
  }

  changePassword(model: ChangePassword): Observable<any> {
    return this.http.patch(`${this.apiUrl}/api/user/changePassword`, model);
  }

  public publishUserChanges(u: User): void {
    this._user.next(u);
  }

  public takeUser(): ReplaySubject<User> {
    return this._user;
  }
}
