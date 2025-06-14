import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../services/auth.service';
import {LanguageService} from '../../services/language.service';
import {Subject, takeUntil} from 'rxjs';
import {Language} from '../../models/language';
import {BrowserStorageService} from '../../services/browser-storage.service';
import {StorageKeys} from '../../services/storage-keys';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {

  destroy$ = new Subject<void>();

  items: MenuItem[] = [];
  languages!: Language[];
  selectedLanguage!: Language | undefined;

  constructor(
    private authService: AuthService,
    private langService: LanguageService,
    private storageService: BrowserStorageService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.setMenuItems();
    this.loadLanguages();

    this.langService.onChangedLanguages
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadLanguages();
      });
  }

  private setMenuItems() {
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

  private loadLanguages() {
    this.langService.getLanguages()
      .pipe(takeUntil(this.destroy$))
      .subscribe(langs => {
        this.languages = [...langs];

        const code = this.storageService.getLocal(StorageKeys.Language);
        this.selectedLanguage = this.languages.find(x => x.languageCode === code);
      })
  }

  onChangeLanguage(value: Language) {
    this.storageService.setLocal(StorageKeys.Language, value.languageCode);
    this.translateService.use(value.languageCode.toLocaleLowerCase());
  }
}
