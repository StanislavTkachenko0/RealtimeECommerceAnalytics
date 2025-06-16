import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {AuthModel} from '../modules/ECommerceClient/models/auth.model';
import {RegisterModel} from '../modules/ECommerceClient/models/register.model';
import {jwtDecode} from 'jwt-decode';
import {VerifyCode} from '../modules/ECommerceClient/models/verify-code';
import {StorageKeys} from './storage-keys';

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

  login(dto: AuthModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, dto);
  }

  verify(model: VerifyCode): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${this.apiUrl}/api/auth/verifyCode`, model)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
          localStorage.removeItem(StorageKeys.VerifyEmail);
          localStorage.removeItem(StorageKeys.SentCode);
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

  public getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch {
      return null;
    }
  }

  public getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
    } catch {
      return null;
    }
  }
}
