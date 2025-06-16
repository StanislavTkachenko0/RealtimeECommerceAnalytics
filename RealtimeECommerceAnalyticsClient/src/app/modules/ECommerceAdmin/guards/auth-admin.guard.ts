import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MessageService} from 'primeng/api';
import {Role} from '../../../enums/Roles';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  canActivate(): boolean {

    console.log(this.authService.getUserRole())

    if (this.authService.hasToken() && this.authService.isTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/sign-in']);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Token Expired.' });
      return false;
    }

    if(this.authService.isAuthenticated() && this.authService.getUserRole() !== Role.Admin) {
      this.router.navigate(['/client']);
      return false;
    }

    if (this.authService.isAuthenticated() && this.authService.getUserRole() === Role.Admin) {
      return true;
    }

    this.router.navigate(['/sign-in']);
    return false;
  }
}
