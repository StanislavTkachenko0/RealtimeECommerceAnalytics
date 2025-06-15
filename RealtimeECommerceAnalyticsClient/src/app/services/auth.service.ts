import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {AuthModel} from '../ECommerceApp/models/auth.model';
import {RegisterModel} from '../ECommerceApp/models/register.model';
import {jwtDecode} from 'jwt-decode';

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
    const raw = localStorage.getItem(this.tokenKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Invalid token format in storage:', e);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  public hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000); // В секундах
      return decoded.exp < now;
    } catch {
      return true;
    }
  }
}
