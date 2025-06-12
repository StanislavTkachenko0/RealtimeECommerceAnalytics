import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {Observable} from 'rxjs';
import {Language} from '../models/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(public http: HttpClient,
              @Inject('API_URL') private apiUrl: string,
              private messageService: MessageService) {
  }

  public uploadJson(code: string, content: string): Observable<any> {
    return this.http.post<string>(`${this.apiUrl}/api/language/uploadjson?code=${code}`, content);
  }

  public getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.apiUrl}/api/language/getlanguageslist`);
  }
}
