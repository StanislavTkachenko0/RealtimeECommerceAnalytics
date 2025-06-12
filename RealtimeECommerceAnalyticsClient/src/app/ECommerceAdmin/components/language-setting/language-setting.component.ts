import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {LanguageService} from '../../../services/language.service';
import {FileUploadHandlerEvent} from 'primeng/fileupload';
import {Language} from '../../../models/language';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'language-setting',
  standalone: false,
  templateUrl: './language-setting.component.html',
})
export class LanguageSettingComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  public languages: Language[] = [];

  constructor(
    private messageService: MessageService,
    private langService: LanguageService,
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.getLanguages();
  }

  private getLanguages() {
    this.langService.getLanguages()
      .pipe(takeUntil(this.destroy$))
      .subscribe(langs => {
        this.languages = [...langs];

        console.log(this.languages)
      })
  }

  uploadJson(event: FileUploadHandlerEvent, code: string) {
    const reader = new FileReader();
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        const content = (reader.result as string).split(',')[1];
        console.log(content)
        this.langService.uploadJson(code, content)
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
          console.log('here', res)
        });
      };
    }
  }

  downloadJson(code: string) {
    const data = { example: 'value' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  deleteLanguage(code: string) {

  }
}
