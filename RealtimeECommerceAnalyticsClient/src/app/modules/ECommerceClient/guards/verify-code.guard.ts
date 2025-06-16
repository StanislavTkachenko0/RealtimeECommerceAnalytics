import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MessageService} from 'primeng/api';
import {BrowserStorageService} from '../../../services/browser-storage.service';
import {StorageKeys} from '../../../services/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class VerifyCodeGuard implements CanActivate {
  constructor(
    private storageService: BrowserStorageService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  canActivate(): boolean {

    if (this.isSentCode()) {
      return true;
    }

    this.router.navigate(['/sign-in']);
    return false;
  }

  private isSentCode(): boolean {
    return !!this.storageService.getLocal(StorageKeys.SentCode);
  }
}
