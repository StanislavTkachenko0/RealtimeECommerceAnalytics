import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {environment} from './environment/environment';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EcommerceAppModule} from './ECommerceApp/ecommerce-app.module';
import {EcommerceAdminModule} from './ECommerceAdmin/ecommerce-admin.module';
import {AuthService} from './services/auth.service';
import {ToastModule} from "primeng/toast";
import {MessageService} from 'primeng/api';
import {HttpClient} from '@angular/common/http';
import {LanguageService} from './services/language.service';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserStorageService} from './services/browser-storage.service';
import {DbTranslateLoader} from './services/db-tanslate.loader';

export function createTranslateLoader(
  http: HttpClient,
  storageService: BrowserStorageService,
) {
  return new DbTranslateLoader(http, storageService);
}

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        EcommerceAppModule,
        EcommerceAdminModule,
        ToastModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient, BrowserStorageService],
          },
          useDefaultLang: false,
        }),
    ],
  providers: [
    {
      provide: 'API_URL',
      useValue: environment.apiUrl
    },
    AuthService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
