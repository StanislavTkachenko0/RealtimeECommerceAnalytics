import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {environment} from '../environment/environment';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EcommerceAppModule} from './modules/ECommerceClient/ecommerce-app.module';
import {EcommerceAdminModule} from './modules/ECommerceAdmin/ecommerce-admin.module';
import {AuthService} from './services/auth.service';
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from 'primeng/api';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {LanguageService} from './services/language.service';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserStorageService} from './services/browser-storage.service';
import {DbTranslateLoader} from './services/db-tanslate.loader';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import { ProfileComponent } from './components/profile/profile.component';
import {FileUploadModule} from 'primeng/fileupload';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';

export function createTranslateLoader(
  http: HttpClient,
  storageService: BrowserStorageService,
) {
  return new DbTranslateLoader(http, storageService);
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent
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
    ConfirmDialogModule,
    ConfirmPopupModule,
    FileUploadModule,
    ReactiveFormsModule,
    InputTextModule,
  ],
  providers: [
    {
      provide: 'API_URL',
      useValue: environment.apiUrl
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
