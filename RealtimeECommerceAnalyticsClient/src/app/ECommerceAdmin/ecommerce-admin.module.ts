import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { MainAdminPageComponent } from './pages/main-admin-page/main-admin-page.component';
import { ControlPanelPageComponent } from './pages/control-panel-page/control-panel-page.component';
import {AuthAdminGuard} from './guards/auth-admin.guard';
import {NavBarModule} from '../modules/nav-bar/nav-bar.module';
import {AccordionModule} from "primeng/accordion";

@NgModule({
  declarations: [
      MainAdminPageComponent,
      MainAdminPageComponent,
      ControlPanelPageComponent
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
                        component: ControlPanelPageComponent
                    },
                ]
            }
        ]),
        NavBarModule,
        AccordionModule
    ],
  providers: [
    AuthAdminGuard
  ],
  bootstrap: []
})
export class EcommerceAdminModule { }
