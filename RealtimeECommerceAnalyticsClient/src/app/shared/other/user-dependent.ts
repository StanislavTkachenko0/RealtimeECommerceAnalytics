import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

export class UserDependent {

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.Initialize();
  }

  private Initialize() {
    if(this.authService.isAuthenticated() && !this.authService.isTokenExpired()) {
      this.loadUser();
    } else {
      this.authService.isLoggedIn$.subscribe((isLogged: boolean) => {
        if (isLogged) {
          this.loadUser();
        }
      });
    }
  }

  private loadUser() {
    const email = this.authService.getUserEmail();

    this.userService.getUser(email ?? '')
      .subscribe(user => {
        this.userService.publishUserChanges(user);
      })
  }
}
