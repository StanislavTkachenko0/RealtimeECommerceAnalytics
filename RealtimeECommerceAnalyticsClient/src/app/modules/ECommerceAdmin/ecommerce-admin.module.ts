import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { MainAdminPageComponent } from './pages/main-admin-page/main-admin-page.component';
import { ControlPanelPageComponent } from './pages/control-panel-page/control-panel-page.component';
import {AuthAdminGuard} from './guards/auth-admin.guard';
import {NavBarModule} from '../nav-bar/nav-bar.module';
import {AccordionModule} from "primeng/accordion";
import { LanguageSettingComponent } from './components/language-setting/language-setting.component';
import {FileUploadModule} from "primeng/fileupload";
import {NgForOf, NgIf} from "@angular/common";
import {CardModule} from 'primeng/card';
import {DialogModule} from "primeng/dialog";
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {TranslatePipe} from "@ngx-translate/core";
import { UsersSettingComponent } from './components/users-setting/users-setting.component';
import {TableModule} from "primeng/table";

@NgModule({
  declarations: [
      MainAdminPageComponent,
      MainAdminPageComponent,
      ControlPanelPageComponent,
      LanguageSettingComponent,
      UsersSettingComponent
  ],
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MainAdminPageComponent,
                canActivate: [AuthAdminGuard],
                children: [
                    {
                        path: '', redirectTo: 'control-panel', pathMatch: 'full'
                    },
                    {
                        path: 'control-panel',
                        component: ControlPanelPageComponent,
                        canActivate: [AuthAdminGuard],
                    },
                ]
            }
        ]),
        NavBarModule,
        AccordionModule,
        FileUploadModule,
        NgForOf,
        CardModule,
        NgIf,
        DialogModule,
        FormsModule,
        InputTextModule,
        TranslatePipe,
        TableModule
    ],
  providers: [
    AuthAdminGuard
  ],
  bootstrap: []
})
export class EcommerceAdminModule { }
