import {EventEmitter, Injectable} from '@angular/core';

export interface BrowserStorageItemChangeEvent {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  onLocalItemChanged = new EventEmitter<BrowserStorageItemChangeEvent>();
  onSessionItemChanged = new EventEmitter<BrowserStorageItemChangeEvent>();

  constructor() {

  }

  getSession(key: string): any {
    const data = window.sessionStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  setSession(key: string, value: any): void {
    const data = value === undefined ? '' : JSON.stringify(value);
    window.sessionStorage.setItem(key, data);
    this.onSessionItemChanged.emit({ key, value } as BrowserStorageItemChangeEvent);
  }

  removeSession(key: string): void {
    window.sessionStorage.removeItem(key);
  }

  removeAllSessions(): void {
    for (const key in window.sessionStorage) {
      if (window.sessionStorage.hasOwnProperty(key)) {
        this.removeSession(key);
      }
    }
  }

  getLocal(key: string): any {
    const data = window.localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  setLocal(key: string, value: any): void {
    const data = value === undefined ? '' : JSON.stringify(value);
    window.localStorage.setItem(key, data);
    this.onLocalItemChanged.emit({ key, value } as BrowserStorageItemChangeEvent);
  }

  removeLocal(key: string): void {
    window.localStorage.removeItem(key);
  }

  removeAllLocals(): void {
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        this.removeLocal(key);
      }
    }
  }
}
