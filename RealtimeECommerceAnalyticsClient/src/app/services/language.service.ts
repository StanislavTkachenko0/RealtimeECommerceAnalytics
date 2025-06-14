import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {Observable, Subject} from 'rxjs';
import {AddLanguage, Language} from '../models/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  onChangedLanguages = new Subject<void>();

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

  public removeLanguage(code: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/language/removeLanguage?code=${code}`);
  }

  public addLanguage(model: AddLanguage): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/language/addLanguage`, model);
  }

  public downloadJson(code: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/language/downloadJson?code=${code}`, {responseType: 'blob'});
  }
}
