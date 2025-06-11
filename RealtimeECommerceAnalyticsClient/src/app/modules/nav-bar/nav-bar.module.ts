import {NgModule} from '@angular/core';
import {NavBarComponent} from './nav-bar.component';
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';
import {Button} from 'primeng/button';

@NgModule({
  declarations: [
    NavBarComponent
  ],
  exports: [
    NavBarComponent
  ],
  imports: [
    MenubarModule,
    MenuModule,
    Button
  ],
  providers: [
  ],
  bootstrap: []
})
export class NavBarModule { }
