import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-sign-in-up',
  standalone: false,
  templateUrl: './sign-in-up.component.html',
  styleUrl: './sign-in-up.component.scss'
})
export class SignInUpComponent {
  isLoginMode = true;
  authForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;
    this.isLoginMode = path === 'sign-in';

    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['']
    });

    if (this.isLoginMode) {
      this.authForm.removeControl('confirmPassword');
    }
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    if (this.isLoginMode) {
      // Вызов метода авторизации
      console.log('Logging in', this.authForm.value);

      this.authService.login(this.authForm.value).subscribe(res => {
        console.log(res)

        this.router.navigate(['/dashboard']).then();
      })
    } else {
      // Вызов метода регистрации
      this.authService.register(this.authForm.value).subscribe(res => {

      })
    }
  }
}
