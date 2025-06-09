import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthModel } from '../models/auth.model';
import { RegisterModel } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient,
              @Inject('API_URL') private apiUrl: string,
              private router: Router) {}

  login(dto: AuthModel): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${this.apiUrl}/api/auth/login`, dto).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
        this.isLoggedInSubject.next(true);
      })
    );
  }

  register(dto: RegisterModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, dto);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/sign-in']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
