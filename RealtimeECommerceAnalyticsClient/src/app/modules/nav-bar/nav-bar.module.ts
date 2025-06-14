import {NgModule} from '@angular/core';
import {NavBarComponent} from './nav-bar.component';
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';
import {Button} from 'primeng/button';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

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
    Button,
    DropdownModule,
    FormsModule,
    TranslatePipe
  ],
  providers: [
  ],
  bootstrap: []
})
export class NavBarModule { }
