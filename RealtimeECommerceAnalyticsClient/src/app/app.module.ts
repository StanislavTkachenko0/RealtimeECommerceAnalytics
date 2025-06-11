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
import { NavBarComponent } from './modules/nav-bar/nav-bar.component';
import {MenubarModule} from 'primeng/menubar';

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
  ],
  providers: [
    {
      provide: 'API_URL',
      useValue: environment.apiUrl
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
