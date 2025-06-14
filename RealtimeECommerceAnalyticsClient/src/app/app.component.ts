import { Component } from '@angular/core';
import {BrowserStorageService} from './services/browser-storage.service';
import {TranslateService} from '@ngx-translate/core';
import {Subject, takeUntil} from 'rxjs';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {

  destroy$ = new Subject<void>();

  title = 'RealtimeECommerceAnalyticsClient';

  constructor(
    storageService: BrowserStorageService,
    translate: TranslateService,
    authService: AuthService,
  ) {
    let lang = "";
    if (storageService.getLocal("lang")) {
      lang = storageService.getLocal("lang");
    }

    translate.use(lang);

    storageService.onLocalItemChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const currentLang = storageService.getLocal("lang");

        if (authService.isAuthenticated()) {
          // get User and update language
        }
      })
  }

}
