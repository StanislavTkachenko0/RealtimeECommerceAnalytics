import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {User} from '../../../models/user';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'users-setting',
  standalone: false,
  templateUrl: './users-setting.component.html',
})
export class UsersSettingComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  users: User[] = [];

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers() {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = [...users];

        console.log(this.users)
      })
  }

  removeUser(user: User, event: MouseEvent) {
    this.confirmationService.confirm({
      target: event.target as HTMLElement,
      message: `Are you sure you want to archive user "${user.email}"?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('User archived:', user);

        this.userService.archiveUser(user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            if (res) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User successfully archived.' });
            } else {
              this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'User archived failed.' });
            }
          })
      }
    });
  }
}
