import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {LanguageService} from '../../../../services/language.service';
import {FileUploadHandlerEvent} from 'primeng/fileupload';
import {AddLanguage, Language} from '../../../../models/language';
import {Subject, takeUntil} from 'rxjs';
import {Dialog} from 'primeng/dialog';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'language-setting',
  standalone: false,
  templateUrl: './language-setting.component.html',
})
export class LanguageSettingComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  public languages: Language[] = [];

  public addLanguageDialogIsOpened = false;
  public languageName = '';
  public languageCode = '';

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

  private getLanguages(changed: boolean = false) {
    this.langService.getLanguages()
      .pipe(takeUntil(this.destroy$))
      .subscribe(langs => {
        this.languages = [...langs];

        if (changed) {
          this.langService.onChangedLanguages.next();
        }
      })
  }

  uploadJson(event: FileUploadHandlerEvent, code: string) {
    const reader = new FileReader();
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        const content = (reader.result as string).split(',')[1];
        this.langService.uploadJson(code, content)
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Translations file successfully upload.' });
          });
      };
    }
  }

  downloadJson(code: string) {
    this.langService.downloadJson(code)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        FileSaver.saveAs(data, 'translation.' + code + '.json');
      })
  }

  removeLanguage(code: string) {
    this.langService.removeLanguage(code)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Language successfully deleted.' });

        this.getLanguages(true);
      })
  }

  openOrCloseAddLanguageDialog(): void {
    this.addLanguageDialogIsOpened = !this.addLanguageDialogIsOpened;
  }

  addLanguage(event: Event, dialog: Dialog): void {
    const model: AddLanguage = {
      languageName: this.languageName,
      languageCode: this.languageCode,
    }

    this.langService.addLanguage(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Language successfully added.' });

        dialog.close(event);

        this.getLanguages(true);
      })
  }
}
