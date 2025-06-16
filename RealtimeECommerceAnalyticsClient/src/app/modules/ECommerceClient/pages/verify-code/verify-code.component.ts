import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BrowserStorageService} from '../../../../services/browser-storage.service';
import {StorageKeys} from '../../../../services/storage-keys';
import {VerifyCode} from '../../models/verify-code';
import {AuthService} from '../../../../services/auth.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-verify-code',
  standalone: false,
  templateUrl: './verify-code.component.html',
})
export class VerifyCodeComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  verifyForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private storageService: BrowserStorageService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.verifyForm = this.fb.group({
      code: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      const code = this.verifyForm.value.code;
      const email = this.storageService.getLocal(StorageKeys.VerifyEmail);

      const model: VerifyCode = {
        code: code,
        email: email
      }

      console.log('Verifying code:', model);

      this.authService.verify(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.router.navigate(['/client']).then();
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error, life: 10 * 1000 });
        })
    }
  }
}
