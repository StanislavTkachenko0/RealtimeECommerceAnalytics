import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil} from 'rxjs';
import {UserService} from '../../services/user.service';
import {MessageService} from 'primeng/api';
import {User} from '../../models/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {matchPasswordAsync} from '../../shared/other/async-validators';
import {ChangePassword} from '../../models/change-password';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  user!: User;

  profileForm!: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.userService.takeUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(u => {
        this.user = u;

        this.buildForm();
      });
  }

  private buildForm() {
    this.profileForm = this.fb.group({
      email: new FormControl({value: this.user.email, disabled: true}),
      firstName: new FormControl(this.user.firstName),
      lastName: new FormControl(this.user.lastName),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required], [
        matchPasswordAsync
      ])
    });

    this.initAutoSave('firstName');
    this.initAutoSave('lastName');
  }

  initAutoSave(field: 'firstName' | 'lastName') {
    this.profileForm.get(field)?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => this.userService.updateProfileField(field, value)) // <-- вызов API
      )
      .subscribe({
        next: () => {
          console.log(`Saved ${field}`);
        },
        error: err => {
          console.error(`Error saving ${field}:`, err);
        }
      });
  }

  onSave() {
    if (this.profileForm.get('password')?.invalid && this.profileForm.get('confirmPassword')?.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const {
      password,
      confirmPassword
    } = this.profileForm.getRawValue();

    if (password && confirmPassword) {
      console.log('Changing password:', {password, confirmPassword});

      const model: ChangePassword = {
        newPassword: confirmPassword
      }

      this.userService
        .changePassword(model)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Password changed successfully.'
            });
            this.profileForm.get('password')?.reset();
            this.profileForm.get('confirmPassword')?.reset();
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Password change failed:' + err});
          }
        });
    }
  }
}
