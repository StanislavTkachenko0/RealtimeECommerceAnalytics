import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {

  items: MenuItem[] = [];

  constructor(private authService: AuthService,) {
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: './profile',
      },
      {
        label: 'Log out',
        icon: 'pi pi-sign-out',
        command: (event) => {
          this.authService.logout();
        }
      }
    ];
  }
}
