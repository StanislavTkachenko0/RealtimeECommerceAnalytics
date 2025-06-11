import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {

    console.log(this.authService.getTokenInfo())

    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/sign-in']);
    return false;
  }
}
