import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {environment} from './environment/environment';
import {EcommerceAppModule} from './ECommerceApp/ecommerce-app.module';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    EcommerceAppModule
  ],
  providers: [
    {
      provide: 'API_URL',
      useValue: environment.apiUrl
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
