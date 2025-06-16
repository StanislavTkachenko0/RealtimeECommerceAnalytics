import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {Observable, Subject, takeUntil} from 'rxjs';
import {matchPasswordAsync, validateIf} from '../../../../shared/other/async-validators';
import {MessageService} from 'primeng/api';
import {BrowserStorageService} from '../../../../services/browser-storage.service';
import {StorageKeys} from '../../../../services/storage-keys';

@Component({
  selector: 'app-sign-in-up',
  standalone: false,
  templateUrl: './sign-in-up.component.html',
})
export class SignInUpComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  isLoginMode = true;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private storageService: BrowserStorageService,
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;
    this.isLoginMode = path === 'sign-in';

    this.form = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        validateIf(() => !this.isLoginMode, Validators.minLength(6))
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern('^\\S+$')
      ], [
        matchPasswordAsync
      ]),
    });

    if (this.isLoginMode) {
      this.form.removeControl('confirmPassword');
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (this.isLoginMode) {
      this.authService.login(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.storageService.setLocal(StorageKeys.VerifyEmail, this.form.value.email);
          this.storageService.setLocal(StorageKeys.SentCode, JSON.stringify(true));
          this.router.navigate(['/verify-code']).then();
      }, err => {
          console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error, life: 10 * 1000 });
      })
    } else {
      this.authService.register(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
        this.router.navigate(['/sign-in']).then();
      })
    }
  }
}
