import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  canActivate(): boolean {

    if (this.authService.hasToken() && this.authService.isTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/sign-in']);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Token Expired.' });
      return false;
    }

    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/sign-in']);
    return false;
  }
}
