import {TranslateLoader} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {BrowserStorageService} from './browser-storage.service';
import {map, Observable} from 'rxjs';
import {JsonHolder} from '../models/json-holder';
import {environment} from '../environment/environment';
import {StorageKeys} from './storage-keys';

export class DbTranslateLoader implements TranslateLoader {

  constructor(private http: HttpClient,
              private storageService: BrowserStorageService) {
  }

  getTranslation(lang: string): Observable<any> {
    return this.http.get<JsonHolder>(environment.apiUrl + '/api/language/getLanguageJsonHolder?code=' + lang)
      .pipe(map((response => {
        if (this.storageService.getLocal(StorageKeys.Language) !== response.languageCode) {
          this.storageService.setLocal(StorageKeys.Language, response.languageCode);
        }

        return JSON.parse(response.json);
      })));
  }
}
